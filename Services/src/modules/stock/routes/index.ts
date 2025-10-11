import { Router } from "express";
import controller from "../controllers/stock.controller";
import { authenticate } from "../../auth/middleware/auth";

const router = Router();

// Read totals by campaign
router.get("/:campaignId/totals", authenticate, (req, res) =>
  controller.getTotals(req, res)
);

// Read lots by campaign (and optional resourceId)
router.get("/:campaignId/lots", authenticate, (req, res) =>
  controller.getLots(req, res)
);

// Consume stock explicitly (optional; distributions normally consume on complete)
router.post("/:campaignId/consume", authenticate, (req, res) =>
  controller.consume(req, res)
);

export default router;
