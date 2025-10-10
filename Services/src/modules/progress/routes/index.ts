import { Router } from "express";
import controller from "../controllers/progress.controller";
import { authenticate } from "../../auth/middleware/auth";

const router = Router();

// Admin or coordinator can post adjustments via this; in practice add role guard
router.post("/ledger", authenticate, (req, res) =>
  controller.postLedger(req, res)
);

export default router;
