import CollectionJob, { ICollectionJob } from "../models/CollectionJob.model";
import progressService from "../../progress/services/progress.service";
import CoordinatorAssignment from "../../agent/coordinator-assignments/models/CoordinatorAssignment.model";
import Campaign from "../../campaign/models/Campaign.model";
import stockService from "../../stock/services/stock.service";

export class CollectionJobService {
  static async create(params: {
    campaignId: string;
    coordinatorAgentId: string;
    resourceId: string;
    targetQty: number;
    assignedVolunteerId?: string;
    pickup?: ICollectionJob["pickup"];
    schedule?: ICollectionJob["schedule"];
    notes?: string;
    createdByUid: string;
  }) {
    const { campaignId, coordinatorAgentId, resourceId, targetQty } = params;
    // Fetch campaign and resource to snapshot
    const campaign = await Campaign.findOne({ campaignID: campaignId }).lean();
    if (!campaign) throw new Error("CAMPAIGN_NOT_FOUND");
    const resource = (campaign.resources || []).find(
      (r: any) => r.id === resourceId
    );
    if (!resource) throw new Error("RESOURCE_NOT_FOUND");

    // Coordinator validation
    const assignment = await CoordinatorAssignment.findOne({
      campaignId,
    }).lean();
    if (!assignment || assignment.agentId !== coordinatorAgentId)
      throw new Error("FORBIDDEN");

    const ts = Date.now().toString(36).toUpperCase();
    const jobId = `COL-${ts}`;
    const job = await CollectionJob.create({
      jobId,
      campaignId,
      coordinatorAgentId,
      resourceId,
      resourceSnapshot: {
        id: resource.id,
        name: resource.name,
        category: resource.category,
        unit: resource.unit,
        quantity: resource.quantity,
        // estimatedCost and description were removed from Campaign.resources on develop
        // Keep snapshot minimal and backward compatible
        targetQty: resource.quantity,
      },
      coordinatorProfile: assignment.coordinatorProfile || undefined,
      targetQty,
      progressQty: 0,
      status: "draft",
      assignedVolunteerId: params.assignedVolunteerId,
      pickup: params.pickup,
      schedule: params.schedule,
      notes: params.notes,
      audit: { createdByUid: params.createdByUid },
    });
    return job.toObject();
  }

  static async list(filter: {
    campaignId: string;
    resourceId?: string;
    status?: string;
    volunteerId?: string;
    page?: number;
    limit?: number;
  }) {
    const { campaignId, resourceId, status, volunteerId } = filter;
    const q: any = { campaignId };
    if (resourceId) q.resourceId = resourceId;
    if (status) q.status = status;
    if (volunteerId) q.assignedVolunteerId = volunteerId;
    const page = Math.max(1, filter.page || 1);
    const limit = Math.max(1, Math.min(100, filter.limit || 20));
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      CollectionJob.find(q)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CollectionJob.countDocuments(q),
    ]);
    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async update(
    jobId: string,
    patch: Partial<ICollectionJob> & { updatedByUid: string }
  ) {
    const { updatedByUid, ...rest } = patch as any;
    const job = await CollectionJob.findByIdAndUpdate(
      jobId,
      { $set: { ...rest, "audit.updatedByUid": updatedByUid } },
      { new: true }
    ).lean();
    if (!job) throw new Error("JOB_NOT_FOUND");
    return job;
  }

  static async start(jobId: string, actorUid: string) {
    const job = await CollectionJob.findOneAndUpdate(
      { _id: jobId, status: { $in: ["scheduled", "draft"] } },
      {
        $set: {
          status: "in_progress",
          "schedule.startedAt": new Date(),
          "audit.updatedByUid": actorUid,
        },
      },
      { new: true }
    ).lean();
    if (!job) throw new Error("INVALID_STATE");
    return job;
  }

  static async complete(
    jobId: string,
    actualQty: number | undefined,
    actorUid: string
  ) {
    const job = await CollectionJob.findById(jobId);
    if (!job) throw new Error("JOB_NOT_FOUND");
    if (job.status === "completed") return job.toObject();
    if (!["in_progress", "scheduled"].includes(job.status))
      throw new Error("INVALID_STATE");
    const qty =
      typeof actualQty === "number" ? Math.max(0, actualQty) : job.targetQty;
    job.status = "completed";
    job.progressQty = qty;
    job.schedule = { ...(job.schedule || {}), completedAt: new Date() } as any;
    job.audit = { ...(job.audit || {}), updatedByUid: actorUid } as any;
    await job.save();
    // Post ledger entry for collection and recompute snapshots
    await progressService.postLedger({
      campaignId: job.campaignId,
      resourceId: job.resourceId,
      delta: job.progressQty, // positive for collection
      sourceType: "collection",
      sourceId: job._id.toString(),
      createdByUid: actorUid,
    });

    // Add to Stock as a new lot (available for distributions)
    await stockService.addLot({
      campaignId: job.campaignId,
      resourceId: job.resourceId,
      quantity: job.progressQty,
      collectionJobId: job._id.toString(),
      resourceSnapshot: {
        name: (job as any).resourceSnapshot?.name,
        unit: (job as any).resourceSnapshot?.unit,
        category: (job as any).resourceSnapshot?.category,
      },
    });
    return job.toObject();
  }

  static async cancel(jobId: string, actorUid: string) {
    const job = await CollectionJob.findOneAndUpdate(
      { _id: jobId, status: { $ne: "completed" } },
      { $set: { status: "cancelled", "audit.updatedByUid": actorUid } },
      { new: true }
    ).lean();
    if (!job) throw new Error("JOB_NOT_FOUND_OR_COMPLETED");
    return job;
  }

  // Add a collection submission record (can be used while in_progress or completed)
  static async addRecord(params: {
    jobId: string;
    volunteerId?: string;
    volunteerName?: string;
    amountSubmitted: number; // delta to add
    note?: string;
    actorUid: string;
  }) {
    const { jobId, amountSubmitted } = params;
    if (amountSubmitted < 0) throw new Error("INVALID_AMOUNT");
    const job = await CollectionJob.findById(jobId);
    if (!job) throw new Error("JOB_NOT_FOUND");
    if (job.status === "cancelled") throw new Error("INVALID_STATE");
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
    // push record and update progress
    (job as any).records = Array.isArray((job as any).records)
      ? ([...(job as any).records, record] as any)
      : ([record] as any);
    job.progressQty = newProgress;
    job.audit = { ...(job.audit || {}), updatedByUid: params.actorUid } as any;
    await job.save();
    return job.toObject();
  }

  static async listRecords(jobId: string) {
    const job = await CollectionJob.findById(jobId).lean();
    if (!job) throw new Error("JOB_NOT_FOUND");
    return (job as any).records || [];
  }
}
