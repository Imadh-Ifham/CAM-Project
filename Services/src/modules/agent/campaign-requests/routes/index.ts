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
  authorizeRoles("admin"),
  AgentCampaignRequestController.approveAgent
);

// PATCH /api/campaigns/:campaignId/reject-request
router.patch(
  "/:campaignId/reject-request",
  authenticate,
  authorizeRoles("admin"),
  AgentCampaignRequestController.rejectRequest
);

// GET /api/campaigns/:campaignId/assignment
router.get(
  "/:campaignId/assignment",
  authenticate,
  // authorization is checked in controller (admin or coordinator)
  AgentCampaignRequestController.getAssignment
);

export default router;
