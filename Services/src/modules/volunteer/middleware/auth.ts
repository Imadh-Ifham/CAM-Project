import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Volunteer from "../models/Volunteer";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export interface AuthRequest extends Request {
  volunteer?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Match the payload from auth controller: { volunteerId, email }
    const volunteer = await Volunteer.findById(decoded.volunteerId);
    if (!volunteer) {
      return res.status(401).json({ message: "Volunteer not found" });
    }

    req.volunteer = volunteer;
    next();
  } catch (err: any) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
