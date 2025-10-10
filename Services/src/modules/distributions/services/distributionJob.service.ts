import { FilterQuery, isValidObjectId } from "mongoose";
import DistributionJobModel, {
  IDistributionJob,
  DistributionStatus,
} from "../models/DistributionJob.model";
import { InventoryModel } from "../../Inventory/models/inventoryModel";
import progressService from "../../progress/services/progress.service";

function genDistributionId(prefix = "DIST"): string {
  const ts = new Date().toISOString().replace(/[-:TZ.]/g, "");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

export class DistributionJobService {
  async create(payload: {
    campaignId: string;
    coordinatorAgentId: string;
    resourceId: string;
    targetQty: number;
    assignedVolunteerId?: string;
    receiverName?: string;
    receiverPhone?: string;
    deliveryInstructions?: string;
    destination?: IDistributionJob["destination"];
    schedule?: IDistributionJob["schedule"];
    notes?: string;
    audit: IDistributionJob["audit"];
    resourceSnapshot?: IDistributionJob["resourceSnapshot"]; // optional when resource is not in Inventory
  }): Promise<IDistributionJob> {
    const { resourceId, targetQty } = payload;

    let snapshot: IDistributionJob["resourceSnapshot"] | undefined;

    // Try to resolve from Inventory when resourceId looks like an ObjectId
    if (isValidObjectId(resourceId)) {
      const inv = await InventoryModel.findById(resourceId);
      if (inv) {
        snapshot = {
          id: resourceId,
          name: inv.name,
          category: inv.category,
          unit: inv.unit,
          availableQty: inv.quantity,
          description: inv.description,
          targetQty: payload.targetQty,
        };
      }
    }

    // Fallback: accept snapshot from payload (e.g., campaign resource)
    if (!snapshot && payload.resourceSnapshot) {
      snapshot = {
        id: payload.resourceSnapshot.id || resourceId,
        name: payload.resourceSnapshot.name,
        category: payload.resourceSnapshot.category,
        unit: payload.resourceSnapshot.unit,
        availableQty: payload.resourceSnapshot.availableQty,
        description: payload.resourceSnapshot.description,
        targetQty: payload.targetQty,
      };
    }

    if (!snapshot) {
      // Neither inventory item nor snapshot provided
      throw new Error("RESOURCE_NOT_FOUND");
    }

    const doc = await DistributionJobModel.create({
      ...payload,
      distributionId: genDistributionId(),
      resourceSnapshot: snapshot,
      status: "draft" as DistributionStatus,
    });
    return doc;
  }

  async list(
    filter: FilterQuery<IDistributionJob> = {},
    options: {
      limit?: number;
      skip?: number;
      sort?: any;
    } = {}
  ): Promise<IDistributionJob[]> {
    const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
    return DistributionJobModel.find(filter).sort(sort).skip(skip).limit(limit);
  }

  async getById(id: string): Promise<IDistributionJob | null> {
    return DistributionJobModel.findById(id);
  }

  async schedule(
    id: string,
    schedule: IDistributionJob["schedule"],
    updatedByUid: string
  ) {
    const job = await DistributionJobModel.findById(id);
    if (!job) throw new Error("JOB_NOT_FOUND");
    if (job.status === "cancelled" || job.status === "completed")
      throw new Error("JOB_FINALIZED");
    job.schedule = schedule;
    job.status = "scheduled";
    job.audit.updatedByUid = updatedByUid;
    return job.save();
  }

  async reserveStock(id: string, qty: number, updatedByUid: string) {
    const job = await DistributionJobModel.findById(id);
    if (!job) throw new Error("JOB_NOT_FOUND");
    if (job.status === "cancelled" || job.status === "completed")
      throw new Error("JOB_FINALIZED");

    // Check inventory availability
    const inv = await InventoryModel.findById(job.resourceId);
    if (!inv) throw new Error("RESOURCE_NOT_FOUND");
    if (inv.quantity < qty) {
      job.status = "blocked_insufficient_stock";
      job.audit.updatedByUid = updatedByUid;
      await job.save();
      throw new Error("INSUFFICIENT_STOCK");
    }

    // Reserve by decreasing available quantity and marking reservedQty on the job
    inv.quantity -= qty;
    // Optionally reflect reservation in status
    if (inv.quantity === 0 && inv.status !== "distributed")
      inv.status = "reserved";
    await inv.save();

    job.reservedQty += qty;
    job.status =
      job.status === "blocked_insufficient_stock" ? "scheduled" : job.status;
    job.audit.updatedByUid = updatedByUid;
    return job.save();
  }

  async start(id: string, updatedByUid: string) {
    const job = await DistributionJobModel.findById(id);
    if (!job) throw new Error("JOB_NOT_FOUND");
    if (job.status === "cancelled" || job.status === "completed")
      throw new Error("JOB_FINALIZED");
    job.status = "in_progress";
    job.schedule = { ...(job.schedule || {}), startedAt: new Date() };
    job.audit.updatedByUid = updatedByUid;
    return job.save();
  }

  async updateProgress(id: string, deliveredQty: number, updatedByUid: string) {
    const job = await DistributionJobModel.findById(id);
    if (!job) throw new Error("JOB_NOT_FOUND");
    if (job.status !== "in_progress" && job.status !== "scheduled")
      throw new Error("JOB_NOT_ACTIVE");
    if (deliveredQty < 0) throw new Error("INVALID_QTY");
    job.progressQty = deliveredQty;
    job.audit.updatedByUid = updatedByUid;
    return job.save();
  }

  async complete(id: string, updatedByUid: string) {
    const job = await DistributionJobModel.findById(id);
    if (!job) throw new Error("JOB_NOT_FOUND");
    if (job.status === "cancelled" || job.status === "completed")
      throw new Error("JOB_FINALIZED");

    // Ensure reserved is at least progress; if not reserved yet, deduct now atomically
    const needToDeduct = Math.max(0, job.progressQty - job.reservedQty);
    if (needToDeduct > 0 && isValidObjectId(job.resourceId)) {
      const inv = await InventoryModel.findById(job.resourceId);
      if (!inv) throw new Error("RESOURCE_NOT_FOUND");
      if (inv.quantity < needToDeduct)
        throw new Error("INSUFFICIENT_STOCK_AT_COMPLETE");
      inv.quantity -= needToDeduct;
      if (inv.quantity === 0) inv.status = "distributed";
      await inv.save();
      job.reservedQty += needToDeduct;
    }

    job.status = "completed";
    job.schedule = { ...(job.schedule || {}), completedAt: new Date() };
    job.audit.updatedByUid = updatedByUid;
    await job.save();

    // Post ledger entry for distribution (negative delta) and recompute snapshots
    await progressService.postLedger({
      campaignId: job.campaignId,
      resourceId: job.resourceId,
      delta: -Math.abs(job.progressQty || job.targetQty),
      sourceType: "distribution",
      sourceId: job._id.toString(),
      createdByUid: updatedByUid,
    });
    return job;
  }

  async cancel(id: string, updatedByUid: string) {
    const job = await DistributionJobModel.findById(id);
    if (!job) throw new Error("JOB_NOT_FOUND");
    if (job.status === "completed") throw new Error("CANNOT_CANCEL_COMPLETED");

    // If stock was reserved, return it
    if (job.reservedQty > 0) {
      const inv = await InventoryModel.findById(job.resourceId);
      if (inv) {
        inv.quantity += job.reservedQty;
        if (inv.status === "distributed" && inv.quantity > 0)
          inv.status = "available";
        await inv.save();
      }
      job.reservedQty = 0;
    }

    job.status = "cancelled";
    job.audit.updatedByUid = updatedByUid;
    return job.save();
  }

  async addRecord(params: {
    id: string;
    volunteerId?: string;
    volunteerName?: string;
    amountSubmitted: number; // delta delivered
    note?: string;
    updatedByUid: string;
  }) {
    const { id, amountSubmitted } = params;
    if (amountSubmitted < 0) throw new Error("INVALID_QTY");
    const job = await DistributionJobModel.findById(id);
    if (!job) throw new Error("JOB_NOT_FOUND");
    if (job.status === "cancelled") throw new Error("JOB_FINALIZED");
    const newProgress = Math.max(0, (job.progressQty || 0) + amountSubmitted);
    const record = {
      volunteerId: params.volunteerId,
      volunteerName: params.volunteerName,
      amountSubmitted,
      completedQtyAfter: newProgress,
      targetQtySnapshot: job.targetQty,
      recordedAt: new Date(),
      note: params.note,
    } as any;
    (job as any).records = Array.isArray((job as any).records)
      ? ([...(job as any).records, record] as any)
      : ([record] as any);
    job.progressQty = newProgress;
    job.audit.updatedByUid = params.updatedByUid;
    await job.save();
    return job.toObject();
  }

  async listRecords(id: string) {
    const job = await DistributionJobModel.findById(id).lean();
    if (!job) throw new Error("JOB_NOT_FOUND");
    return (job as any).records || [];
  }
}

export default new DistributionJobService();
