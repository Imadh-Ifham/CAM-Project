import { Router } from "express";
import dotenv from "dotenv";
import Volunteer from "../models/Volunteer";
import authMiddleware from "../middleware/auth";
import admin from "../../../config/firebaseAdmin";

dotenv.config();

const router = Router();

// REGISTER - Firebase token required
router.post("/register", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    const { fullName, age, email, phoneNumber, skillsAndInterest, availability } = req.body;

    if (!fullName || !email) return res.status(400).json({ message: "Missing required fields" });
    if (email !== decodedToken.email)
      return res.status(400).json({ message: "Email mismatch between token and payload" });

    const existing = await Volunteer.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const volunteer = new Volunteer({
      fullName,
      age,
      email,
      phoneNumber,
      skillsAndInterest,
      availability,
      firebaseUid: decodedToken.uid,
      passwordHash: "firebase-managed",
    });

    await volunteer.save();
    const safeVolunteer = volunteer.toObject();
    delete (safeVolunteer as any).passwordHash;

    res.status(201).json({ volunteer: safeVolunteer });
  } catch (err: any) {
    console.error("Register error:", err);
    if (err.code === "auth/argument-error") {
      res.status(400).json({ message: "Invalid Firebase token" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

// LOGIN - Sync Firebase user
router.post("/login", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Missing email" });
    if (email !== decodedToken.email)
      return res.status(400).json({ message: "Email mismatch between token and payload" });

    let volunteer = await Volunteer.findOne({ email });
    if (!volunteer) {
      volunteer = new Volunteer({
        email,
        firebaseUid: decodedToken.uid,
        fullName: decodedToken.name || email.split("@")[0],
        passwordHash: "firebase-managed",
      });
      await volunteer.save();
    } else if (!volunteer.firebaseUid) {
      volunteer.firebaseUid = decodedToken.uid;
      await volunteer.save();
    }

    const safeVolunteer = volunteer.toObject();
    delete (safeVolunteer as any).passwordHash;

    res.json({ volunteer: safeVolunteer });
  } catch (err: any) {
    console.error("Login error:", err);
    if (err.code === "auth/argument-error") {
      res.status(400).json({ message: "Invalid Firebase token" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

// GET /me
router.get("/me", authMiddleware, async (req: any, res) => {
  if (!req.volunteer) return res.status(401).json({ message: "Unauthorized" });
  res.json({ volunteer: req.volunteer });
});

// UPDATE /me
router.put("/me", authMiddleware, async (req: any, res) => {
  try {
    const { fullName, age, phoneNumber, preferredType, skillsAndInterest, availability } = req.body;
    const updated = await Volunteer.findByIdAndUpdate(
      req.volunteer._id,
      { fullName, age, phoneNumber, preferredType, skillsAndInterest, availability },
      { new: true }
    ).select("-passwordHash");

    if (!updated) return res.status(404).json({ message: "Volunteer not found" });
    res.json({ volunteer: updated });
  } catch (err: any) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
