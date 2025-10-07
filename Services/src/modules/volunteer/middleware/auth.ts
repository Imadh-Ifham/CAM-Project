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
    const auth = req.headers.authorization;
    if (!auth || typeof auth !== "string") return res.status(401).json({ message: "No Authorization header" });
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    if (!payload?.id) return res.status(401).json({ message: "Invalid token payload" });

    const volunteer = await Volunteer.findById(payload.id).select("-passwordHash").lean();
    if (!volunteer) return res.status(401).json({ message: "Volunteer not found" });

    req.volunteer = volunteer;
    next();
  } catch (err: any) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
