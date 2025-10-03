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

    let userDoc: IUserDocument | null = await User.findOne({
      uid: decoded.uid,
    });
    if (!userDoc) {
      // Defer role assignment to controller; default to volunteer as placeholder
      userDoc = await User.create({
        uid: decoded.uid,
        email: decoded.email || "",
        role: "volunteer",
        fullName: decoded.name || "",
        phoneNumber: decoded.phone_number,
      });
    }
    req.userDoc = userDoc!;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
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
