import { Request, Response } from "express";
import User from "../../models/User";

type AuthenticatedRequest = Request & { user?: any };

export async function registerVolunteer(
  req: AuthenticatedRequest,
  res: Response
) {
  const { fullName, email, phoneNumber, age, skillsAndInterest, availability } =
    req.body;
  const { uid } = req.user || {};
  if (!uid) return res.status(401).json({ message: "Unauthorized" });

  try {
    const update = {
      uid,
      email: email || req.user?.email || "",
      phoneNumber: phoneNumber || req.user?.phone_number,
      role: "volunteer" as const,
      fullName,
      volunteerProfile: { age, skillsAndInterest, availability },
      agentProfile: undefined,
    };

    const user = await User.findOneAndUpdate(
      { uid },
      { $set: update },
      { new: true, upsert: true }
    );

    return res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to register volunteer" });
  }
}
