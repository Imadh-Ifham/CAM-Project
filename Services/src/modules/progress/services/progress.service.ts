import InventoryLedgerModel, {
  IInventoryLedger,
  LedgerSourceType,
} from "../models/InventoryLedger.model";
import ProgressSnapshotModel from "../models/ProgressSnapshot.model";
import CoordinatorAssignment from "../../agent/coordinator-assignments/models/CoordinatorAssignment.model";
import CampaignModel from "../../campaign/models/Campaign.model";

export class ProgressService {
  async postLedger(params: {
    campaignId: string;
    resourceId: string;
    delta: number;
    sourceType: LedgerSourceType;
    sourceId: string;
    createdByUid: string;
    idempotencyKey?: string;
  }): Promise<IInventoryLedger> {
    const {
      campaignId,
      resourceId,
      delta,
      sourceType,
      sourceId,
      createdByUid,
      idempotencyKey,
    } = params;

    // Basic validation
    const campaign = await CampaignModel.findOne({
      campaignID: campaignId,
    }).lean();
    if (!campaign) throw new Error("CAMPAIGN_NOT_FOUND");
    const res = (campaign.resources || []).find(
      (r: any) => r.id === resourceId
    );
    if (!res) throw new Error("RESOURCE_NOT_FOUND");

    // Idempotency: if a ledger exists for same sourceType+sourceId, return it
    const existing = await InventoryLedgerModel.findOne({
      sourceType,
      sourceId,
    }).lean();
    if (existing) return existing as any;

    const entry = await InventoryLedgerModel.create({
      campaignId,
      resourceId,
      delta,
      sourceType,
      sourceId,
      committedAt: new Date(),
      createdByUid,
      idempotencyKey,
    });

    // Recompute snapshot and update coordinator stats
    await this.recomputeSnapshotAndStats(campaignId, resourceId);
    return entry.toObject();
  }

  async recomputeSnapshotAndStats(campaignId: string, resourceId: string) {
    // Aggregate ledger
    const [collectedAgg, distributedAgg] = await Promise.all([
      InventoryLedgerModel.aggregate([
        { $match: { campaignId, resourceId, sourceType: "collection" } },
        { $group: { _id: null, total: { $sum: "$delta" } } },
      ]),
      InventoryLedgerModel.aggregate([
        { $match: { campaignId, resourceId, sourceType: "distribution" } },
        { $group: { _id: null, total: { $sum: "$delta" } } },
      ]),
    ]);

    const collectedQty = collectedAgg[0]?.total || 0;
    const distributedQty = Math.abs(distributedAgg[0]?.total || 0); // distributions are negative deltas

    // Get target from campaign resource
    const campaign = await (
      await import("../../campaign/models/Campaign.model")
    ).default
      .findOne({ campaignID: campaignId })
      .lean();
    const resource = (campaign?.resources || []).find(
      (r: any) => r.id === resourceId
    );
    const targetQty = resource?.quantity || 0;

    // We start without reservation; reservedQty = 0 for now
    const reservedQty = 0;
    const availableQty = collectedQty - distributedQty - reservedQty;

    await ProgressSnapshotModel.findOneAndUpdate(
      { campaignId, resourceId },
      {
        $set: {
          targetQty,
          collectedQty,
          distributedQty,
          reservedQty,
          availableQty,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    // Update CoordinatorAssignment stats.byResource
    const assignment = await CoordinatorAssignment.findOne({ campaignId });
    if (assignment) {
      const collectionsByRes = assignment.stats?.collections?.byResource || [];
      const distributionsByRes =
        assignment.stats?.distributions?.byResource || [];

      const collIdx = collectionsByRes.findIndex(
        (r: any) => r.resourceId === resourceId
      );
      if (collIdx >= 0) collectionsByRes[collIdx].collectedQty = collectedQty;
      else
        collectionsByRes.push({
          resourceId,
          name: resource?.name || "",
          unit: resource?.unit || "",
          collectedQty,
          targetQty,
        });

      const distIdx = distributionsByRes.findIndex(
        (r: any) => r.resourceId === resourceId
      );
      if (distIdx >= 0)
        distributionsByRes[distIdx].distributedQty = distributedQty;
      else
        distributionsByRes.push({
          resourceId,
          name: resource?.name || "",
          unit: resource?.unit || "",
          distributedQty,
          targetQty,
        });

      // Compute overall progress percent as min(100, (collected/target)*100) simple heuristic
      const totalTarget =
        (assignment.resourcesSnapshot || []).reduce(
          (acc: number, r: any) => acc + (r.targetQty || 0),
          0
        ) || targetQty;
      const totalCollected = collectionsByRes.reduce(
        (acc: number, r: any) => acc + (r.collectedQty || 0),
        0
      );
      const overallPercent =
        totalTarget > 0
          ? Math.min(100, Math.round((totalCollected / totalTarget) * 100))
          : 0;

      assignment.set("stats.collections.byResource", collectionsByRes);
      assignment.set("stats.distributions.byResource", distributionsByRes);
      assignment.set("stats.progress.overallPercent", overallPercent);
      await assignment.save();
    }
  }
}

export default new ProgressService();
