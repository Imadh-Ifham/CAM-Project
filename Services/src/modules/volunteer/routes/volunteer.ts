import { Router } from "express";
import Volunteer from "../models/Volunteer";
import authMiddleware, { AuthRequest } from "../middleware/auth";

const router = Router();

/**
 * @route   GET /api/volunteers/me
 * @desc    Get the logged-in volunteer's profile
 * @access  Private (Volunteer)
 */
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const volunteer = req.volunteer;
    if (!volunteer)
      return res.status(404).json({ message: "Volunteer not found" });

    res.json({ volunteer });
  } catch (err: any) {
    console.error("Get profile error:", err.message || err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   PUT /api/volunteers/me
 * @desc    Update volunteer's profile (name, phone, preferred type)
 * @access  Private (Volunteer)
 */
router.put("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, phone, preferredType } = req.body;
    const volunteer = await Volunteer.findById(req.volunteer._id);

    if (!volunteer)
      return res.status(404).json({ message: "Volunteer not found" });

    if (name) volunteer.name = name;
    if (phone) volunteer.phone = phone;
    if (preferredType) volunteer.preferredType = preferredType;

    await volunteer.save();

    const updatedVolunteer = volunteer.toObject();
    delete (updatedVolunteer as any).passwordHash;

    res.json({
      message: "Profile updated successfully",
      volunteer: updatedVolunteer,
    });
  } catch (err: any) {
    console.error("Update profile error:", err.message || err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/volunteers/me
 * @desc    Delete volunteer account (optional feature)
 * @access  Private (Volunteer)
 */
router.delete("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.volunteer._id);
    res.json({ message: "Volunteer account deleted successfully" });
  } catch (err: any) {
    console.error("Delete profile error:", err.message || err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
