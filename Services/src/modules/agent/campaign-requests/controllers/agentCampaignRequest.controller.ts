import { Request, Response } from "express";
import AgentCampaignRequestService from "../services/agentCampaignRequest.service";
import CoordinatorAssignment from "../../coordinator-assignments/models/CoordinatorAssignment.model";

export default class AgentCampaignRequestController {
  static async listAssignments(req: Request, res: Response) {
    try {
      const { status = "active", page, limit } = req.query as any;
      const pg = page ? parseInt(String(page), 10) : 1;
      const lm = limit ? parseInt(String(limit), 10) : 50;
      const skip = (Math.max(1, pg) - 1) * Math.max(1, lm);

      const filter: any = {};
      if (status) filter.status = status;

      const [items, total] = await Promise.all([
        CoordinatorAssignment.find(filter)
          .select(
            [
              "campaignId",
              "agentId",
              "status",
              "startedAt",
              "campaign.name",
              "campaign.city",
              "campaign.district",
              "campaign.type",
              "coordinatorProfile.fullName",
              "coordinatorProfile.email",
              "coordinatorProfile.phoneNumber",
              // keep stats minimal; values may be zeroed for now
              "stats.collections.completed",
              "stats.collections.target",
              "stats.distributions.completed",
              "stats.distributions.target",
            ].join(" ")
          )
          .sort({ startedAt: -1 })
          .skip(skip)
          .limit(Math.max(1, lm))
          .lean(),
        CoordinatorAssignment.countDocuments(filter),
      ]);

      return res.status(200).json({
        success: true,
        data: items,
        pagination: {
          page: Math.max(1, pg),
          limit: Math.max(1, lm),
          total,
          totalPages: Math.ceil(total / Math.max(1, lm)),
        },
      });
    } catch (err) {
      console.error("[listAssignments]", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async listPending(req: Request, res: Response) {
    try {
      const { campaignId, page, limit } = req.query as any;
      const result = await AgentCampaignRequestService.listRequests({
        status: "pending",
        campaignId,
        page: page ? parseInt(String(page), 10) : undefined,
        limit: limit ? parseInt(String(limit), 10) : undefined,
      });
      return res.status(200).json({
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

      const approver = (req as any).userDoc || (req as any).user || {};
      const { campaign, approvedReq, assignment } =
        await AgentCampaignRequestService.approveAgent(campaignId, agentId, {
          approvedByUid: approver?.uid || approver?.user_id || "unknown",
          approvedByEmail: approver?.email,
        });

      return res.status(200).json({
        campaign,
        approvedRequest: approvedReq,
        assignment,
        campaignRelation: { hasCoordinator: true, coordinatorAgentId: agentId },
      });
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

  static async rejectRequest(req: Request, res: Response) {
    try {
      const { campaignId } = req.params as { campaignId: string };
      const { requestId, agentId } = req.body as {
        requestId?: string;
        agentId?: string;
      };
      if (!requestId && !agentId)
        return res
          .status(400)
          .json({ message: "requestId or agentId is required" });

      const result = await AgentCampaignRequestService.rejectRequest(
        campaignId,
        { requestId, agentId }
      );
      return res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      switch (err?.message) {
        case "REQUEST_NOT_FOUND":
          return res.status(404).json({ message: "Request not found" });
        case "REQUEST_NOT_PENDING":
          return res
            .status(400)
            .json({ message: "Only pending requests can be rejected" });
        case "CAMPAIGN_NOT_FOUND":
          return res.status(404).json({ message: "Campaign not found" });
        default:
          console.error("[rejectRequest]", err);
          return res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async getAssignment(req: Request, res: Response) {
    try {
      const { campaignId } = req.params as { campaignId: string };
      const assignment = await CoordinatorAssignment.findOne({ campaignId });
      if (!assignment)
        return res.status(404).json({ message: "Assignment not found" });

      const userDoc: any = (req as any).userDoc;
      const isAdmin = userDoc?.role === "admin";
      const isCoordinator =
        userDoc?.agentId && userDoc.agentId === assignment.agentId;
      if (!isAdmin && !isCoordinator) {
        return res.status(403).json({ message: "Forbidden" });
      }
      return res.status(200).json({ success: true, data: assignment });
    } catch (err) {
      console.error("[getAssignment]", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
