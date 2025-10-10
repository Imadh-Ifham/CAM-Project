import { Request, Response } from "express";
import progressService from "../services/progress.service";
import ProgressSnapshotModel from "../models/ProgressSnapshot.model";

export class ProgressController {
  async postLedger(req: Request, res: Response) {
    try {
      const entry = await progressService.postLedger(req.body);
      res.status(201).json(entry);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getSnapshots(req: Request, res: Response) {
    try {
      const { campaignId } = req.params as { campaignId: string };
      const items = await ProgressSnapshotModel.find({ campaignId }).lean();
      res.json({ data: items });
    } catch (err: any) {
      res
        .status(500)
        .json({ error: err.message || "FAILED_TO_FETCH_SNAPSHOTS" });
    }
  }

  async getResourceSnapshot(req: Request, res: Response) {
    try {
      const { campaignId, resourceId } = req.params as {
        campaignId: string;
        resourceId: string;
      };
      const item = await ProgressSnapshotModel.findOne({
        campaignId,
        resourceId,
      }).lean();
      res.json({ data: item || null });
    } catch (err: any) {
      res
        .status(500)
        .json({ error: err.message || "FAILED_TO_FETCH_SNAPSHOT" });
    }
  }
}

export default new ProgressController();
