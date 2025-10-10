import { Router } from "express";
import CampaignController from "../controllers/campaign.controller";
import {
  validateCreateCampaign,
  validateStatusUpdate,
  validateCampaignId,
} from "../middleware/validation.middleware";

// Middleware imports (assuming these exist in your auth module)
// import { authenticate } from '../../auth/middleware/auth.middleware';
// import { authorize } from '../../auth/middleware/role.middleware';

const router = Router();

/**
 * Campaign Routes
 * Base path: /api/campaigns
 */

// Create a new campaign
// POST /api/campaigns
router.post(
  "/",
  // authenticate, // Uncomment when auth middleware is available
  // authorize(['admin', 'coordinator']), // Uncomment when role middleware is available
  validateCreateCampaign,
  CampaignController.createCampaign
);

// Get campaign statistics
// GET /api/campaigns/stats
router.get(
  "/stats",
  // authenticate, // Uncomment when auth middleware is available
  CampaignController.getCampaignStats
);

// Get all campaigns with filters and pagination
// GET /api/campaigns
router.get(
  "/",
  // authenticate, // Uncomment when auth middleware is available
  CampaignController.getCampaigns
);

// Get campaign by ID
// GET /api/campaigns/:campaignId
router.get(
  "/:campaignId",
  // authenticate, // Uncomment when auth middleware is available
  validateCampaignId,
  CampaignController.getCampaignById
);

// Update campaign status
// PATCH /api/campaigns/:campaignId/status
router.patch(
  "/:campaignId/status",
  // authenticate, // Uncomment when auth middleware is available
  // authorize(['admin', 'coordinator']), // Uncomment when role middleware is available
  validateCampaignId,
  validateStatusUpdate,
  CampaignController.updateCampaignStatus
);

// Delete campaign (soft delete)
// DELETE /api/campaigns/:campaignId
router.delete(
  "/:campaignId",
  // authenticate, // Uncomment when auth middleware is available
  // authorize(['admin', 'coordinator']), // Uncomment when role middleware is available
  validateCampaignId,
  CampaignController.deleteCampaign
);

export default router;
