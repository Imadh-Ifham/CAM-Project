import { Router } from "express";
import controller from "../controllers/distributionJob.controller";
import { authenticate } from "../../auth/middleware/auth";

const router = Router({ mergeParams: true });

// Create a distribution job (campaign-scoped)
router.post("/:campaignId/distributions", authenticate, (req, res) => {
  req.body.campaignId = req.params.campaignId;
  controller.create(req, res);
});

// List distribution jobs for a campaign
router.get("/:campaignId/distributions", authenticate, (req, res) => {
  req.query.campaignId = req.params.campaignId;
  controller.list(req, res);
});

// Single job operations
router.get("/:campaignId/distributions/:id", authenticate, (req, res) =>
  controller.getById(req, res)
);
router.patch(
  "/:campaignId/distributions/:id/schedule",
  authenticate,
  (req, res) => controller.schedule(req, res)
);
router.post(
  "/:campaignId/distributions/:id/reserve",
  authenticate,
  (req, res) => controller.reserve(req, res)
);
router.post("/:campaignId/distributions/:id/start", authenticate, (req, res) =>
  controller.start(req, res)
);
router.post(
  "/:campaignId/distributions/:id/progress",
  authenticate,
  (req, res) => controller.updateProgress(req, res)
);
router.post(
  "/:campaignId/distributions/:id/complete",
  authenticate,
  (req, res) => controller.complete(req, res)
);
router.post("/:campaignId/distributions/:id/cancel", authenticate, (req, res) =>
  controller.cancel(req, res)
);

// Records
router.post(
  "/:campaignId/distributions/:id/records",
  authenticate,
  (req, res) => controller.createRecord(req, res)
);
router.get("/:campaignId/distributions/:id/records", authenticate, (req, res) =>
  controller.listRecords(req, res)
);

export default router;
