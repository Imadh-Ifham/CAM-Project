import { Request, Response } from "express";
import CollectionLog from "../models/CollectionLog";

export const createCollectionLog = async (req: any, res: Response) => {
  try {
    const { campaignId, items, note } = req.body;
    if (!campaignId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "campaignId and items[] required" });
    }
    const log = await CollectionLog.create({ campaignId, volunteerId: req.volunteer._id, items, note });
    res.status(201).json({ log });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const listCollectionLogs = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;
    const q: any = {};
    if (campaignId) q.campaignId = campaignId;
    const logs = await CollectionLog.find(q).populate("volunteerId", "name email").lean();
    res.json({ logs });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
