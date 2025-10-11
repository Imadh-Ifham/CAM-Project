import { Router } from "express";
import controller from "../controllers/progress.controller";
import { authenticate } from "../../auth/middleware/auth";

const router = Router();

// Admin or coordinator can post adjustments via this; in practice add role guard
router.post("/ledger", authenticate, (req, res) =>
  controller.postLedger(req, res)
);

// Fetch all snapshots for a campaign
router.get("/:campaignId/snapshots", authenticate, (req, res) =>
  controller.getSnapshots(req, res)
);

// Fetch a specific resource snapshot for a campaign
router.get(
  "/:campaignId/resources/:resourceId/snapshot",
  authenticate,
  (req, res) => controller.getResourceSnapshot(req, res)
);

export default router;
