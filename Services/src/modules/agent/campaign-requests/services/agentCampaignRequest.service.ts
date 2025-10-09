import mongoose from "mongoose";
import Campaign, { ICampaign } from "../../../campaign/models/Campaign.model";
import AgentCampaignRequest, {
  IAgentCampaignRequest,
} from "../models/AgentCampaignRequest.model";
import User from "../../../auth/models/User";
import CoordinatorAssignment from "../../coordinator-assignments/models/CoordinatorAssignment.model";

export default class AgentCampaignRequestService {
  static async listRequests(options?: {
    status?: "pending" | "approved" | "rejected" | "canceled";
    campaignId?: string; // campaignID
    page?: number;
    limit?: number;
  }) {
    const status = options?.status || "pending";
    const campaignId = options?.campaignId;
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, Math.min(100, options?.limit || 50));
    const skip = (page - 1) * limit;

    const filter: any = { status };
    if (campaignId) filter.campaignId = campaignId;

    const [items, total] = await Promise.all([
      AgentCampaignRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AgentCampaignRequest.countDocuments(filter),
    ]);

    // Batch load related users and campaigns
    const agentIds = Array.from(new Set(items.map((i) => i.agentId)));
    const campaignIds = Array.from(new Set(items.map((i) => i.campaignId)));

    const [users, campaigns] = await Promise.all([
      User.find({ agentId: { $in: agentIds } })
        .select("agentId fullName email phoneNumber uid role")
        .lean(),
      Campaign.find({ campaignID: { $in: campaignIds } })
        .select("campaignID name type city district status")
        .lean(),
    ]);

    const userByAgentId = new Map(users.map((u: any) => [u.agentId, u]));
    const campaignById = new Map(campaigns.map((c: any) => [c.campaignID, c]));

    const enriched = items.map((i) => ({
      _id: i._id,
      agentId: i.agentId,
      campaignId: i.campaignId,
      status: i.status,
      experience: i.experience,
      motivation: i.motivation,
      availability: i.availability,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
      agent: userByAgentId.get(i.agentId) || null,
      campaign: campaignById.get(i.campaignId) || null,
    }));

    return {
      items: enriched,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  static async createOrGetJoinRequest(
    campaignId: string,
    agentId: string,
    payload: Pick<
      IAgentCampaignRequest,
      "experience" | "motivation" | "availability"
    >
  ) {
    // Validate campaign
    const campaign = await Campaign.findOne({ campaignID: campaignId });
    if (!campaign) throw new Error("CAMPAIGN_NOT_FOUND");
    if (campaign.status !== "active") throw new Error("CAMPAIGN_NOT_ACTIVE");
    if (campaign.coordinatorAgentId)
      throw new Error("COORDINATOR_ALREADY_ASSIGNED");

    const update = {
      $setOnInsert: {
        agentId,
        campaignId, // store campaignID string
      },
      $set: {
        experience: payload.experience,
        motivation: payload.motivation,
        availability: payload.availability,
        status: "pending" as const,
      },
    };

    const request = await AgentCampaignRequest.findOneAndUpdate(
      { agentId, campaignId },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Idempotently push agentId into campaign.requestedAgent
    if (!campaign.requestedAgent.includes(agentId)) {
      campaign.requestedAgent.push(agentId);
      await campaign.save();
    }

    return { request, campaign };
  }

  static async approveAgent(
    campaignId: string,
    agentId: string,
    opts?: { approvedByUid?: string; approvedByEmail?: string }
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const campaign = await Campaign.findOne({
        campaignID: campaignId,
      }).session(session);
      if (!campaign) throw new Error("CAMPAIGN_NOT_FOUND");
      if (campaign.coordinatorAgentId)
        throw new Error("COORDINATOR_ALREADY_ASSIGNED");

      // Set coordinator agent id
      campaign.coordinatorAgentId = agentId;
      // ensure coordinator object exists
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      campaign.coordinator = campaign.coordinator || {};
      // flag will be synced by pre-save as well, but set it explicitly for readability
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      campaign.coordinator.isAssigned = true;

      // Populate coordinator contact from agent profile if available
      const userDoc = await User.findOne({ agentId }).session(session);
      if (userDoc) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        campaign.coordinator.email =
          userDoc.email || campaign.coordinator.email;
        // only set phone if present; validation is relaxed but still may fail on garbage
        if (userDoc.phoneNumber) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          campaign.coordinator.phone = userDoc.phoneNumber;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        campaign.coordinator.name =
          userDoc.fullName || campaign.coordinator.name;
      }

      // Clean requested agents
      campaign.requestedAgent = [];
      await campaign.save({ session });

      // Update the approved request
      const approvedReq = await AgentCampaignRequest.findOneAndUpdate(
        { agentId, campaignId },
        { $set: { status: "approved" } },
        { new: true, session }
      );

      // Reject other requests of this campaign
      await AgentCampaignRequest.updateMany(
        { campaignId, agentId: { $ne: agentId }, status: { $in: ["pending"] } },
        { $set: { status: "rejected" } },
        { session }
      );

      // Create CoordinatorAssignment (unique per campaign)
      const resourcesSnapshot = (campaign.resources || []).map((r: any) => ({
        resourceId: r.id,
        name: r.name,
        unit: r.unit,
        targetQty: typeof r.quantity === "number" ? r.quantity : undefined,
      }));

      const assignmentDoc = await CoordinatorAssignment.create(
        [
          {
            campaignId,
            agentId,
            role: "coordinator",
            status: "active",
            audit: {
              approvedByUid: opts?.approvedByUid || "unknown",
              approvedByEmail: opts?.approvedByEmail,
              approvedAt: new Date(),
            },
            campaign: {
              name: campaign.name,
              type: campaign.type,
              district: campaign.district,
              city: campaign.city,
              location: campaign.location,
            },
            coordinatorProfile: {
              fullName: userDoc?.fullName,
              email: userDoc?.email,
              phoneNumber: userDoc?.phoneNumber,
            },
            resourcesSnapshot,
            stats: {
              progress: { overallPercent: 0 },
              collections: {
                completed: 0,
                target: undefined,
                byResource: resourcesSnapshot.map((r) => ({
                  resourceId: r.resourceId,
                  name: r.name,
                  unit: r.unit,
                  collectedQty: 0,
                  targetQty: r.targetQty,
                })),
              },
              distributions: {
                completed: 0,
                target: undefined,
                byResource: resourcesSnapshot.map((r) => ({
                  resourceId: r.resourceId,
                  name: r.name,
                  unit: r.unit,
                  distributedQty: 0,
                  targetQty: r.targetQty,
                })),
              },
              tasks: { open: 0, completed: 0 },
            },
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();
      return { campaign, approvedReq, assignment: assignmentDoc?.[0] };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  static async rejectRequest(
    campaignId: string,
    params: { requestId?: string; agentId?: string }
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Find request
      let reqDoc: any = null;
      if (params.requestId) {
        reqDoc = await AgentCampaignRequest.findOne({
          _id: params.requestId,
          campaignId,
        }).session(session);
      } else if (params.agentId) {
        reqDoc = await AgentCampaignRequest.findOne({
          agentId: params.agentId,
          campaignId,
        }).session(session);
      }

      if (!reqDoc) throw new Error("REQUEST_NOT_FOUND");
      if (reqDoc.status !== "pending") throw new Error("REQUEST_NOT_PENDING");

      // Mark as rejected
      reqDoc.status = "rejected";
      await reqDoc.save({ session });

      // Pull from campaign.requestedAgent
      const campaign = await Campaign.findOne({
        campaignID: campaignId,
      }).session(session);
      if (!campaign) throw new Error("CAMPAIGN_NOT_FOUND");
      campaign.requestedAgent = (campaign.requestedAgent || []).filter(
        (a) => a !== reqDoc.agentId
      );
      await campaign.save({ session });

      await session.commitTransaction();
      session.endSession();
      return { request: reqDoc, campaign };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
}
