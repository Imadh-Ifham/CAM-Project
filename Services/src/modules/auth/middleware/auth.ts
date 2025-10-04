import { Request, Response, NextFunction } from "express";
import admin from "../../../config/firebaseAdmin";
import User, { IUserDocument, UserRole } from "../models/User";

type AuthenticatedRequest = Request & {
  user?: any;
  userDoc?: IUserDocument;
};

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : undefined;
  if (!token)
    return res.status(401).json({ message: "Missing Authorization token" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;

    const userDoc: IUserDocument | null = await User.findOne({
      uid: decoded.uid,
    });
    // Do NOT create here; let the specific controller (registerAgent/registerVolunteer)
    // create or upsert the user with proper required fields from the request body.
    req.userDoc = userDoc || undefined;
    next();
  } catch (err: any) {
    // Temporary detailed logging to diagnose token issues
    console.error("[AUTH] verifyIdToken failed:", {
      message: err?.message,
      code: err?.code,
      name: err?.name,
    });
    return res.status(401).json({
      message: "Invalid or expired token",
      code: err?.code,
      details: err?.message,
    });
  }
}

export function authorizeRoles(...allowed: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role = req.userDoc?.role;
    if (!role || !allowed.includes(role))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
