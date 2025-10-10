import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Volunteer from "../models/Volunteer";
import authMiddleware from "../middleware/auth";

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      age,
      email,
      password,
      phoneNumber,
      preferredType,
      skillsAndInterest,
      availability,
    } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const existing = await Volunteer.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const volunteer = new Volunteer({
      fullName,
      age,
      email,
      passwordHash,
      phoneNumber,
      preferredType,
      skillsAndInterest,
      availability,
    });
    await volunteer.save();

    const token = jwt.sign({ id: volunteer._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const safeVolunteer = volunteer.toObject();
    delete (safeVolunteer as any).passwordHash;

    res.status(201).json({ volunteer: safeVolunteer, token });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, volunteer.passwordHash);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: volunteer._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const safeVolunteer = volunteer.toObject();
    delete (safeVolunteer as any).passwordHash;

    res.json({ volunteer: safeVolunteer, token });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET current volunteer profile
router.get("/me", authMiddleware, async (req: any, res) => {
  try {
    if (!req.volunteer)
      return res.status(401).json({ message: "Unauthorized" });
    res.json({ volunteer: req.volunteer });
  } catch (err: any) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE volunteer profile
router.put("/me", authMiddleware, async (req: any, res) => {
  try {
    const {
      fullName,
      age,
      phoneNumber,
      preferredType,
      skillsAndInterest,
      availability,
    } = req.body;
    const updated = await Volunteer.findByIdAndUpdate(
      req.volunteer._id,
      { fullName, age, phoneNumber, preferredType, skillsAndInterest, availability },
      { new: true }
    ).select("-passwordHash");

    if (!updated)
      return res.status(404).json({ message: "Volunteer not found" });

    res.json({ volunteer: updated });
  } catch (err: any) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
