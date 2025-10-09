import mongoose from "mongoose";
import Campaign, { ICampaign } from "../../../campaign/models/Campaign.model";
import AgentCampaignRequest, {
  IAgentCampaignRequest,
} from "../models/AgentCampaignRequest.model";
import User from "../../../auth/models/User";

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

  static async approveAgent(campaignId: string, agentId: string) {
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
      campaign.coordinator.isAssigned = true;

      // Populate coordinator contact from agent profile if available
      const userDoc = await User.findOne({ agentId }).session(session);
      if (userDoc) {
        campaign.coordinator.email = userDoc.email;
        campaign.coordinator.phone =
          userDoc.phoneNumber || campaign.coordinator.phone;
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

      await session.commitTransaction();
      session.endSession();
      return { campaign, approvedReq };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
}
