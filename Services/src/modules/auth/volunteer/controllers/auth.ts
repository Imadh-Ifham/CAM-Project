import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Volunteer from "../../../volunteer/models/Volunteer";

export async function registerVolunteer(req: Request, res: Response) {
  try {
    console.log("=== REGISTER DEBUG ===");
    console.log("req.body:", req.body);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("===================");

    const { email, password, name, phone, preferredType } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Email, password, and name are required",
        received: { email, password: !!password, name },
      });
    }

    // Check if volunteer already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create volunteer - only include preferredType if provided
    const volunteerData: any = {
      email,
      passwordHash,
      name,
      phone,
    };

    if (preferredType) {
      volunteerData.preferredType = preferredType;
    }

    const volunteer = new Volunteer(volunteerData);

    await volunteer.save();

    // Generate JWT token
    const token = jwt.sign(
      { volunteerId: volunteer._id, email: volunteer.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Volunteer registered successfully",
      token,
      volunteer: {
        id: volunteer._id,
        email: volunteer.email,
        name: volunteer.name,
      },
    });
  } catch (err: any) {
    console.error("Register error DETAILS:", err.message, err.stack); // See full error
    res
      .status(500)
      .json({ message: "Failed to register volunteer", error: err.message });
  }
}

export async function loginVolunteer(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Find volunteer
    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(
      password,
      volunteer.passwordHash
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { volunteerId: volunteer._id, email: volunteer.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      volunteer: {
        id: volunteer._id,
        email: volunteer.email,
        name: volunteer.name,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err.message || err);
    res.status(500).json({ message: "Failed to login" });
  }
}
