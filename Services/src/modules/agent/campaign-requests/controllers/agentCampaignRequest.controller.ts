import { Request, Response } from "express";
import AgentCampaignRequestService from "../services/agentCampaignRequest.service";

export default class AgentCampaignRequestController {
  static async listPending(req: Request, res: Response) {
    try {
      const { campaignId, page, limit } = req.query as any;
      const result = await AgentCampaignRequestService.listRequests({
        status: "pending",
        campaignId,
        page: page ? parseInt(String(page), 10) : undefined,
        limit: limit ? parseInt(String(limit), 10) : undefined,
      });
      return res
        .status(200)
        .json({
          success: true,
          data: result.items,
          pagination: result.pagination,
        });
    } catch (err) {
      console.error("[listPending]", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async createJoinRequest(req: Request, res: Response) {
    try {
      const { campaignId } = req.params as { campaignId: string };
      const agentId = (req as any).userDoc?.agentId || (req as any).user?.uid;
      if (!agentId) return res.status(401).json({ message: "Unauthorized" });

      const { experience, motivation, availability } = req.body || {};
      const { request, campaign } =
        await AgentCampaignRequestService.createOrGetJoinRequest(
          campaignId,
          agentId,
          { experience, motivation, availability }
        );

      return res.status(200).json({
        request,
        campaignRelation: {
          requestedAgentCount: campaign.requestedAgent.length,
          hasCoordinator: Boolean(campaign.coordinatorAgentId),
          isRequested: true,
        },
      });
    } catch (err: any) {
      switch (err?.message) {
        case "CAMPAIGN_NOT_FOUND":
          return res.status(404).json({ message: "Campaign not found" });
        case "CAMPAIGN_NOT_ACTIVE":
          return res.status(400).json({ message: "Campaign not active" });
        case "COORDINATOR_ALREADY_ASSIGNED":
          return res
            .status(409)
            .json({ message: "Coordinator already assigned" });
        default:
          console.error("[createJoinRequest]", err);
          return res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async approveAgent(req: Request, res: Response) {
    try {
      const { campaignId } = req.params as { campaignId: string };
      const { agentId } = req.body as { agentId?: string };
      if (!agentId)
        return res.status(400).json({ message: "agentId is required" });

      const { campaign, approvedReq } =
        await AgentCampaignRequestService.approveAgent(campaignId, agentId);

      return res.status(200).json({ campaign, approvedRequest: approvedReq });
    } catch (err: any) {
      switch (err?.message) {
        case "CAMPAIGN_NOT_FOUND":
          return res.status(404).json({ message: "Campaign not found" });
        case "COORDINATOR_ALREADY_ASSIGNED":
          return res
            .status(409)
            .json({ message: "Coordinator already assigned" });
        default:
          console.error("[approveAgent]", err);
          return res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}
