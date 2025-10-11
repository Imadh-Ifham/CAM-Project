import { Request, Response } from "express";
import { CollectionJobService } from "../services/collectionJob.service";

export default class CollectionJobController {
  static async create(req: Request, res: Response) {
    try {
      const { campaignId } = req.params as { campaignId: string };
      const userDoc: any = (req as any).userDoc;
      const coordinatorAgentId = userDoc?.agentId;
      if (!coordinatorAgentId)
        return res.status(403).json({ message: "Forbidden" });
      const body = req.body || {};
      const job = await CollectionJobService.create({
        campaignId,
        coordinatorAgentId,
        resourceId: body.resourceId,
        targetQty: body.targetQty,
        assignedVolunteerId: body.assignedVolunteerId,
        pickup: body.pickup,
        schedule: body.schedule,
        notes: body.notes,
        createdByUid: userDoc?.uid || (req as any).user?.uid || "unknown",
      });
      return res.status(201).json({ success: true, data: job });
    } catch (err: any) {
      switch (err?.message) {
        case "CAMPAIGN_NOT_FOUND":
          return res.status(404).json({ message: "Campaign not found" });
        case "RESOURCE_NOT_FOUND":
          return res
            .status(400)
            .json({ message: "Resource not found in campaign" });
        case "FORBIDDEN":
          return res.status(403).json({
            message: "Only the coordinator can create collection jobs",
          });
        default:
          console.error("[CollectionJob.create]", err);
          return res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const { campaignId } = req.params as { campaignId: string };
      const { resourceId, status, volunteerId, page, limit } = req.query as any;
      const result = await CollectionJobService.list({
        campaignId,
        resourceId,
        status,
        volunteerId,
        page: page ? parseInt(String(page), 10) : undefined,
        limit: limit ? parseInt(String(limit), 10) : undefined,
      });
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      console.error("[CollectionJob.list]", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { jobId } = req.params as any;
      const userDoc: any = (req as any).userDoc;
      const job = await CollectionJobService.update(jobId, {
        ...(req.body || {}),
        updatedByUid: userDoc?.uid || (req as any).user?.uid || "unknown",
      } as any);
      return res.status(200).json({ success: true, data: job });
    } catch (err: any) {
      if (err?.message === "JOB_NOT_FOUND")
        return res.status(404).json({ message: "Job not found" });
      console.error("[CollectionJob.update]", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async start(req: Request, res: Response) {
    try {
      const { jobId } = req.params as any;
      const userDoc: any = (req as any).userDoc;
      const job = await CollectionJobService.start(
        jobId,
        userDoc?.uid || (req as any).user?.uid || "unknown"
      );
      return res.status(200).json({ success: true, data: job });
    } catch (err: any) {
      if (err?.message === "INVALID_STATE")
        return res
          .status(400)
          .json({ message: "Job not in a startable state" });
      console.error("[CollectionJob.start]", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async complete(req: Request, res: Response) {
    try {
      const { jobId } = req.params as any;
      const { actualQty } = req.body || {};
      const userDoc: any = (req as any).userDoc;
      const job = await CollectionJobService.complete(
        jobId,
        actualQty,
        userDoc?.uid || (req as any).user?.uid || "unknown"
      );
      return res.status(200).json({ success: true, data: job });
    } catch (err: any) {
      if (err?.message === "JOB_NOT_FOUND")
        return res.status(404).json({ message: "Job not found" });
      if (err?.message === "INVALID_STATE")
        return res
          .status(400)
          .json({ message: "Job not in a completable state" });
      console.error("[CollectionJob.complete]", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async cancel(req: Request, res: Response) {
    try {
      const { jobId } = req.params as any;
      const userDoc: any = (req as any).userDoc;
      const job = await CollectionJobService.cancel(
        jobId,
        userDoc?.uid || (req as any).user?.uid || "unknown"
      );
      return res.status(200).json({ success: true, data: job });
    } catch (err: any) {
      if (err?.message === "JOB_NOT_FOUND_OR_COMPLETED")
        return res
          .status(404)
          .json({ message: "Job not found or already completed" });
      console.error("[CollectionJob.cancel]", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // POST /:campaignId/collections/:jobId/records
  static async createRecord(req: Request, res: Response) {
    try {
      const { jobId } = req.params as any;
      const body = req.body || {};
      const userDoc: any = (req as any).userDoc;
      const job = await CollectionJobService.addRecord({
        jobId,
        volunteerId: body.volunteerId,
        volunteerName: body.volunteerName,
        amountSubmitted: Number(body.amountSubmitted || 0),
        note: body.note,
        actorUid: userDoc?.uid || (req as any).user?.uid || "unknown",
      });
      return res.status(201).json({ success: true, data: job });
    } catch (err: any) {
      if (err?.message === "JOB_NOT_FOUND")
        return res.status(404).json({ message: "Job not found" });
      if (err?.message === "INVALID_AMOUNT")
        return res.status(400).json({ message: "Invalid amount" });
      if (err?.message === "INVALID_STATE")
        return res
          .status(400)
          .json({ message: "Cannot add records to cancelled job" });
      console.error("[CollectionJob.createRecord]", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // GET /:campaignId/collections/:jobId/records
  static async listRecords(req: Request, res: Response) {
    try {
      const { jobId } = req.params as any;
      const records = await CollectionJobService.listRecords(jobId);
      return res.status(200).json({ success: true, data: records });
    } catch (err: any) {
      if (err?.message === "JOB_NOT_FOUND")
        return res.status(404).json({ message: "Job not found" });
      console.error("[CollectionJob.listRecords]", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
