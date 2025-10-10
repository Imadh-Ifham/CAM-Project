import { Router } from "express";
import { authenticate } from "../../auth/middleware/auth";
import CollectionJobController from "../controllers/collectionJob.controller";

const router = Router({ mergeParams: true });

// Collections endpoints (coordinator only to create/start/complete/cancel; list is visible to coordinator and admin)
router.post(
  "/:campaignId/collections",
  authenticate,
  CollectionJobController.create
);
router.get(
  "/:campaignId/collections",
  authenticate,
  CollectionJobController.list
);
router.patch(
  "/:campaignId/collections/:jobId",
  authenticate,
  CollectionJobController.update
);
router.post(
  "/:campaignId/collections/:jobId/start",
  authenticate,
  CollectionJobController.start
);
router.post(
  "/:campaignId/collections/:jobId/complete",
  authenticate,
  CollectionJobController.complete
);
router.post(
  "/:campaignId/collections/:jobId/cancel",
  authenticate,
  CollectionJobController.cancel
);

export default router;
