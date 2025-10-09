import { Request, Response } from "express";
import User from "../../models/User";
import { generateUniqueAgentId } from "../../utils/id";

type AuthenticatedRequest = Request & { user?: any };

export async function registerAgent(req: AuthenticatedRequest, res: Response) {
  const {
    fullName,
    email,
    phoneNumber,
    organization,
    experienceAndMotivation,
  } = req.body;
  const { uid } = req.user || {};
  if (!uid) return res.status(401).json({ message: "Unauthorized" });

  try {
    // Find existing user by Firebase UID
    let user = await User.findOne({ uid });

    if (!user) {
      // Create new user as agent
      user = new (User as any)({
        uid,
        email: email || req.user?.email || "",
        phoneNumber: phoneNumber || req.user?.phone_number,
        role: "agent" as const,
        fullName,
        agentProfile: { organization, experienceAndMotivation },
        volunteerProfile: undefined,
      });
      // Assign a unique agentId
      user.agentId = await generateUniqueAgentId();
      await user.save();
    } else {
      // Update to agent and set profile fields
      user.email = email || user.email || req.user?.email || "";
      user.phoneNumber =
        phoneNumber || user.phoneNumber || req.user?.phone_number;
      user.role = "agent" as const;
      user.fullName = fullName ?? user.fullName;
      user.agentProfile = { organization, experienceAndMotivation };
      user.volunteerProfile = undefined;
      // Ensure agentId exists (set once)
      if (!user.agentId) {
        user.agentId = await generateUniqueAgentId();
      }
      await user.save();
    }

    return res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to register agent" });
  }
}
