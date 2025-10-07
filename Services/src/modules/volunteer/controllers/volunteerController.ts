import { Request, Response } from "express";
import Volunteer from "../models/Volunteer";
import Campaign from "../models/Campaign";

// list
export const listVolunteers = async (_: Request, res: Response) => {
  try {
    const volunteers = await Volunteer.find().select("-passwordHash").lean();
    res.json({ volunteers });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// get profile (protected)
export const getProfile = async (req: any, res: Response) => {
  try {
    return res.json({ volunteer: req.volunteer });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// update profile (protected)
export const updateProfile = async (req: any, res: Response) => {
  try {
    const updates = (({ name, phone, preferredType }) => ({ name, phone, preferredType }))(req.body);
    const updated = await Volunteer.findByIdAndUpdate(req.volunteer._id, updates, { new: true }).select("-passwordHash").lean();
    res.json({ volunteer: updated });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// assign volunteer to campaign (open/admin)
export const assignVolunteerToCampaign = async (req: Request, res: Response) => {
  try {
    const { volunteerId, campaignId, role } = req.body;
    if (!volunteerId || !campaignId) return res.status(400).json({ message: "volunteerId and campaignId required" });

    await Campaign.findByIdAndUpdate(campaignId, { $addToSet: { assignedVolunteers: { volunteerId, role } } });
    await Volunteer.findByIdAndUpdate(volunteerId, { $addToSet: { assignedCampaigns: campaignId } });

    res.json({ message: "Assigned successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
