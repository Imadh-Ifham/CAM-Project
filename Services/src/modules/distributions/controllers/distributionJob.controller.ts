import { Request, Response } from "express";
import distributionJobService from "../services/distributionJob.service";

function mapError(err: any) {
  const msg = typeof err === "string" ? err : err.message;
  switch (msg) {
    case "RESOURCE_NOT_FOUND":
      return { code: 404, message: msg };
    case "JOB_NOT_FOUND":
      return { code: 404, message: msg };
    case "FORBIDDEN":
      return { code: 403, message: msg };
    case "INSUFFICIENT_STOCK":
    case "INSUFFICIENT_STOCK_AT_COMPLETE":
      return { code: 409, message: msg };
    case "JOB_FINALIZED":
    case "CANNOT_CANCEL_COMPLETED":
    case "JOB_NOT_ACTIVE":
    case "INVALID_QTY":
      return { code: 400, message: msg };
    default:
      return { code: 500, message: msg };
  }
}

export class DistributionJobController {
  async create(req: Request, res: Response) {
    try {
      const userDoc: any = (req as any).userDoc;
      const coordinatorAgentId = userDoc?.agentId;
      if (!coordinatorAgentId)
        return res.status(403).json({ error: "FORBIDDEN" });
      const body = req.body || {};
      const doc = await distributionJobService.create({
        campaignId: body.campaignId,
        coordinatorAgentId,
        resourceId: body.resourceId,
        targetQty: body.targetQty,
        resourceSnapshot: body.resourceSnapshot,
        assignedVolunteerId: body.assignedVolunteerId,
        receiverName: body.receiverName,
        receiverPhone: body.receiverPhone,
        deliveryInstructions: body.deliveryInstructions,
        destination: body.destination,
        schedule: body.schedule,
        notes: body.notes,
        audit: {
          createdByUid: userDoc?.uid || (req as any).user?.uid || "unknown",
        },
      });
      res.status(201).json(doc);
    } catch (err) {
      const { code, message } = mapError(err);
      res.status(code).json({ error: message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const filter: any = {};
      if (req.query.campaignId) filter.campaignId = req.query.campaignId;
      if (req.query.status) filter.status = req.query.status;
      const docs = await distributionJobService.list(filter, {
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        skip: req.query.skip ? Number(req.query.skip) : undefined,
      });
      res.json(docs);
    } catch (err) {
      const { code, message } = mapError(err);
      res.status(code).json({ error: message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const doc = await distributionJobService.getById(req.params.id);
      if (!doc) return res.status(404).json({ error: "JOB_NOT_FOUND" });
      res.json(doc);
    } catch (err) {
      const { code, message } = mapError(err);
      res.status(code).json({ error: message });
    }
  }

  async schedule(req: Request, res: Response) {
    try {
      const doc = await distributionJobService.schedule(
        req.params.id,
        req.body,
        req.body.updatedByUid
      );
      res.json(doc);
    } catch (err) {
      const { code, message } = mapError(err);
      res.status(code).json({ error: message });
    }
  }

  async reserve(req: Request, res: Response) {
    try {
      const doc = await distributionJobService.reserveStock(
        req.params.id,
        req.body.qty,
        req.body.updatedByUid
      );
      res.json(doc);
    } catch (err) {
      const { code, message } = mapError(err);
      res.status(code).json({ error: message });
    }
  }

  async start(req: Request, res: Response) {
    try {
      const doc = await distributionJobService.start(
        req.params.id,
        req.body.updatedByUid
      );
      res.json(doc);
    } catch (err) {
      const { code, message } = mapError(err);
      res.status(code).json({ error: message });
    }
  }

  async updateProgress(req: Request, res: Response) {
    try {
      const doc = await distributionJobService.updateProgress(
        req.params.id,
        req.body.deliveredQty,
        req.body.updatedByUid
      );
      res.json(doc);
    } catch (err) {
      const { code, message } = mapError(err);
      res.status(code).json({ error: message });
    }
  }

  async complete(req: Request, res: Response) {
    try {
      const doc = await distributionJobService.complete(
        req.params.id,
        req.body.updatedByUid
      );
      res.json(doc);
    } catch (err) {
      const { code, message } = mapError(err);
      res.status(code).json({ error: message });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const doc = await distributionJobService.cancel(
        req.params.id,
        req.body.updatedByUid
      );
      res.json(doc);
    } catch (err) {
      const { code, message } = mapError(err);
      res.status(code).json({ error: message });
    }
  }

  async createRecord(req: Request, res: Response) {
    try {
      const doc = await distributionJobService.addRecord({
        id: req.params.id,
        volunteerId: req.body.volunteerId,
        volunteerName: req.body.volunteerName,
        amountSubmitted: Number(req.body.amountSubmitted || 0),
        note: req.body.note,
        updatedByUid: req.body.updatedByUid,
      });
      res.status(201).json(doc);
    } catch (err) {
      const { code, message } = mapError(err);
      res.status(code).json({ error: message });
    }
  }

  async listRecords(req: Request, res: Response) {
    try {
      const docs = await distributionJobService.listRecords(req.params.id);
      res.json(docs);
    } catch (err) {
      const { code, message } = mapError(err);
      res.status(code).json({ error: message });
    }
  }
}

export default new DistributionJobController();
