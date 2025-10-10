import { Request, Response } from "express";
import DistributionLog from "../models/DistributionLog";

export const createDistributionLog = async (req: any, res: Response) => {
  try {
    const { campaignId, items, beneficiaryName, note } = req.body;
    if (!campaignId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "campaignId and items[] required" });
    }
    const log = await DistributionLog.create({ campaignId, volunteerId: req.volunteer._id, items, beneficiaryName, note });
    res.status(201).json({ log });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const listDistributionLogs = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;
    const q: any = {};
    if (campaignId) q.campaignId = campaignId;
    const logs = await DistributionLog.find(q).populate("volunteerId", "fullName email").lean();
    res.json({ logs });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
