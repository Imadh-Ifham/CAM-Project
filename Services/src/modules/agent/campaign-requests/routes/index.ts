import { Router } from "express";
import AgentCampaignRequestController from "../controllers/agentCampaignRequest.controller";
import { authenticate, authorizeRoles } from "../../../auth/middleware/auth";

const router = Router({ mergeParams: true });

// GET /api/campaigns/agent-requests?status=pending&campaignId=DIS-123
router.get(
  "/agent-requests",
  authenticate,
  // Only admins should access the admin agent management pending list
  authorizeRoles("admin"),
  AgentCampaignRequestController.listPending
);

// POST /api/campaigns/:campaignId/join-requests
router.post(
  "/:campaignId/join-requests",
  authenticate,
  authorizeRoles("agent"),
  AgentCampaignRequestController.createJoinRequest
);

// PATCH /api/campaigns/:campaignId/approve-agent
router.patch(
  "/:campaignId/approve-agent",
  authenticate,
  // In future we may have "admin" role in UserRole; for now permit agent for development if needed
  // Replace with authorizeRoles("admin") once admin role is implemented
  authorizeRoles("agent"),
  AgentCampaignRequestController.approveAgent
);

export default router;
