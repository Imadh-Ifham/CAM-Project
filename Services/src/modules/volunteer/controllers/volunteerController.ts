import { Request, Response } from "express";
import Volunteer from "../models/Volunteer";
import Campaign from "../../campaign/models/Campaign.model";

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
export const assignVolunteerToCampaign = async (req: any, res: Response) => {
  try {
    const { campaignId, volunteerId, role } = req.body;
    
    if (!volunteerId || !campaignId) {
      return res.status(400).json({ 
        success: false,
        message: "volunteerId and campaignId required" 
      });
    }

    // Verify campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ 
        success: false,
        message: "Campaign not found" 
      });
    }

    // Verify volunteer exists
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ 
        success: false,
        message: "Volunteer not found" 
      });
    }

    // Check if already assigned
    const alreadyAssigned = (campaign as any).assignedVolunteers?.some(
      (v: any) => v.volunteerId?.toString() === volunteerId
    );
    
    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "Volunteer already assigned to this campaign"
      });
    }

    // Add volunteer to campaign's assignedVolunteers array
    await Campaign.findByIdAndUpdate(campaignId, {
      $addToSet: { 
        assignedVolunteers: { 
          volunteerId, 
          role: role || "volunteer" 
        } 
      },
    });

    // Add campaign to volunteer's assignedCampaigns
    await Volunteer.findByIdAndUpdate(volunteerId, {
      $addToSet: { assignedCampaigns: campaignId },
    });

    res.json({ 
      success: true,
      message: "Volunteer assigned to campaign successfully" 
    });
  } catch (err: any) {
    console.error("Assign volunteer error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
