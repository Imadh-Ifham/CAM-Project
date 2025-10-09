import User from "../models/User";

function randomCode(len = 6) {
  // URL-safe base36-ish uppercase code
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // avoid ambiguous chars
  let out = "";
  for (let i = 0; i < len; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function generateUniqueAgentId(prefix = "AGT"): Promise<string> {
  // Retry up to a few times to avoid rare collisions
  for (let i = 0; i < 10; i++) {
    const candidate = `${prefix}-${randomCode(6)}`;
    const exists = await User.findOne({ agentId: candidate }).lean().exec();
    if (!exists) return candidate;
  }
  // Fallback with timestamp if collisions persist
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}
