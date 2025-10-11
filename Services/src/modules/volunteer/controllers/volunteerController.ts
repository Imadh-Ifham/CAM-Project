import { Request, Response } from "express";
import Volunteer from "../models/Volunteer";
import Campaign from "../../campaign/models/Campaign.model";

interface AuthRequest extends Request {
  volunteer?: any;
}

// List all volunteers (admin/agent)
export const listVolunteers = async (_: Request, res: Response) => {
  try {
    const volunteers = await Volunteer.find().select("-passwordHash").lean();
    res.json({ volunteers });
  } catch (err: any) {
    console.error("List volunteers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get logged-in volunteer profile
export const getProfile = async (req: any, res: Response) => {
  try {
    return res.json({ volunteer: req.volunteer });
  } catch (err: any) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update volunteer profile
export const updateProfile = async (req: any, res: Response) => {
  try {
    const updates = (({ fullName, phoneNumber, preferredType, skillsAndInterest, availability }) => 
      ({ fullName, phoneNumber, preferredType, skillsAndInterest, availability }))(req.body);
    
    const updated = await Volunteer.findByIdAndUpdate(
      req.volunteer._id, 
      updates, 
      { new: true }
    ).select("-passwordHash").lean();
    
    if (!updated) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    res.json({ volunteer: updated });
  } catch (err: any) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign volunteer to campaign
export const assignVolunteerToCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { campaignId } = req.body;
    const volunteerId = req.volunteer?._id;

    if (!campaignId || !volunteerId) {
      return res.status(400).json({ message: "Missing campaign or volunteer ID" });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    // Check if already assigned
    const isAlreadyAssigned = campaign.assignedVolunteers.some(
      (v: any) => v.toString() === volunteerId.toString()
    );
    
    if (isAlreadyAssigned) {
      return res.status(409).json({ message: "Volunteer already assigned to this campaign" });
    }

    // Assign volunteer
    campaign.assignedVolunteers.push(volunteerId);
    await campaign.save();

    if (!volunteer.assignedCampaigns.includes(campaignId)) {
      volunteer.assignedCampaigns.push(campaignId);
      await volunteer.save();
    }

    res.json({ 
      message: "Volunteer assigned successfully",
      campaign,
      volunteer: { ...volunteer.toObject(), passwordHash: undefined }
    });
  } catch (error: any) {
    console.error("Assign volunteer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get assigned campaigns for a volunteer
export const getAssignedCampaigns = async (req: any, res: Response) => {
  try {
    const volunteer = await Volunteer.findById(req.volunteer._id)
      .populate({
        path: "assignedCampaigns",
        populate: {
          path: "assignedAgents",
          select: "fullName email phoneNumber organization"
        }
      })
      .select("-passwordHash")
      .lean();

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    res.json({ campaigns: volunteer.assignedCampaigns || [] });
  } catch (err: any) {
    console.error("Get assigned campaigns error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
