import mongoose from "mongoose";
import Campaign, { ICampaign } from "../../../campaign/models/Campaign.model";
import AgentCampaignRequest, {
  IAgentCampaignRequest,
} from "../models/AgentCampaignRequest.model";
import User from "../../../auth/models/User";

export default class AgentCampaignRequestService {
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
