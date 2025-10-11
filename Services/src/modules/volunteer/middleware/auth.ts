import { Request, Response, NextFunction } from "express";
import admin from "../../../config/firebaseAdmin";
import Volunteer from "../models/Volunteer";

interface AuthRequest extends Request {
  volunteer?: any;
  firebaseUser?: admin.auth.DecodedIdToken;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decodedToken;

    // Find volunteer by Firebase UID or email
    const volunteer = await Volunteer.findOne({
      $or: [
        { firebaseUid: decodedToken.uid },
        { email: decodedToken.email }
      ]
    }).select("-passwordHash");

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer profile not found" });
    }

    req.volunteer = volunteer;
    next();
  } catch (err: any) {
    console.error("Auth middleware error:", err);
    if (err.code === "auth/id-token-expired") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (err.code === "auth/argument-error") {
      return res.status(401).json({ message: "Invalid token format" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
