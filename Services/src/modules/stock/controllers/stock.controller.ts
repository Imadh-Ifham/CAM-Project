import { Request, Response } from "express";
import stockService from "../services/stock.service";

export class StockController {
  // For reads
  async getTotals(req: Request, res: Response) {
    try {
      const { campaignId } = req.params as { campaignId: string };
      const data = await stockService.getTotals(campaignId);
      res.json({ data });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "FAILED_TO_FETCH_STOCK" });
    }
  }

  async consume(req: Request, res: Response) {
    try {
      const { campaignId } = req.params as { campaignId: string };
      const { resourceId, qty, distributionJobId } = req.body as any;
      const out = await stockService.consumeFIFO({
        campaignId,
        resourceId,
        qty,
        distributionJobId,
      });
      res.json({ data: out });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async getLots(req: Request, res: Response) {
    try {
      const { campaignId } = req.params as { campaignId: string };
      const { resourceId } = req.query as any;
      const q: any = { campaignId };
      if (resourceId) q.resourceId = resourceId;
      const lots = await (await import("../models/Stock.model")).default
        .find(q)
        .sort({ createdAt: -1 })
        .lean();
      res.json({ data: lots });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "FAILED_TO_FETCH_LOTS" });
    }
  }
}

export default new StockController();
