import { FilterQuery } from "mongoose";
import DistributionJobModel, {
  IDistributionJob,
  DistributionStatus,
} from "../models/DistributionJob.model";
import progressService from "../../progress/services/progress.service";
import stockService from "../../stock/services/stock.service";

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
    const { resourceId } = payload;

    // Accept snapshot only from payload (campaign resource snapshot)
    const snapFromPayload = payload.resourceSnapshot
      ? {
          id: payload.resourceSnapshot.id || resourceId,
          name: payload.resourceSnapshot.name,
          category: payload.resourceSnapshot.category,
          unit: payload.resourceSnapshot.unit,
          availableQty: payload.resourceSnapshot.availableQty,
          description: payload.resourceSnapshot.description,
          targetQty: payload.targetQty,
        }
      : undefined;

    if (!snapFromPayload) {
      throw new Error("RESOURCE_NOT_FOUND");
    }

    const doc = await DistributionJobModel.create({
      ...payload,
      distributionId: genDistributionId(),
      resourceSnapshot: snapFromPayload,
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
    // Check availability using Stock totals only; do not mutate stock here
    const totals = await stockService.getTotals(job.campaignId);
    const t = totals.find((r) => r.resourceId === job.resourceId);
    const available = t?.totalAvailable || 0;
    if (available < qty) {
      job.status = "blocked_insufficient_stock";
      job.audit.updatedByUid = updatedByUid;
      await job.save();
      throw new Error("INSUFFICIENT_STOCK");
    }

    // Logical reservation on the job only
    job.reservedQty = (job.reservedQty || 0) + Math.max(0, qty);
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

    // Consume from Stock (FIFO) matching the delivered quantity
    const delivered = Math.max(0, job.progressQty || job.targetQty);
    await stockService.consumeFIFO({
      campaignId: job.campaignId,
      resourceId: job.resourceId,
      qty: delivered,
      distributionJobId: job._id.toString(),
    });
    return job;
  }

  async cancel(id: string, updatedByUid: string) {
    const job = await DistributionJobModel.findById(id);
    if (!job) throw new Error("JOB_NOT_FOUND");
    if (job.status === "completed") throw new Error("CANNOT_CANCEL_COMPLETED");
    // If reservedQty tracked, clear it (we don't mutate stock for reservations)
    if (job.reservedQty > 0) job.reservedQty = 0;

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
