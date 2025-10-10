import dotenv from "dotenv";
dotenv.config();

import connectDB from "../../../config/db";
import admin from "../../../config/firebaseAdmin";
import User from "../models/User";

/**
 * One-off script to ensure an Admin user document exists in MongoDB.
 * Uses Firebase Auth as the source of truth for identity.
 *
 * Reads from environment variables (preferred):
 *  - ADMIN_EMAIL (required if ADMIN_UID not provided)
 *  - ADMIN_NAME  (defaults to "Administrator")
 *  - ADMIN_UID   (optional; if provided, skips lookup by email)
 *
 * You can also pass CLI args:
 *  --email="admin@example.com"  --name="Site Admin"  --uid="<firebase-uid>"
 */

type CliArgs = {
  email?: string;
  name?: string;
  uid?: string;
};

function parseCliArgs(): CliArgs {
  const out: CliArgs = {};
  for (const arg of process.argv.slice(2)) {
    const m = arg.match(/^--(email|name|uid)=(.*)$/);
    if (m) {
      const [, key, val] = m;
      if (key === "email") out.email = val;
      if (key === "name") out.name = val;
      if (key === "uid") out.uid = val;
    }
  }
  return out;
}

async function main() {
  const cli = parseCliArgs();
  const ADMIN_EMAIL = cli.email || process.env.ADMIN_EMAIL;
  const ADMIN_NAME = cli.name || process.env.ADMIN_NAME || "Administrator";
  const ADMIN_UID = cli.uid || process.env.ADMIN_UID;

  if (!ADMIN_UID && !ADMIN_EMAIL) {
    console.error(
      "ERROR: Provide ADMIN_UID or ADMIN_EMAIL via env or CLI (e.g., --email=admin@example.com)"
    );
    process.exit(1);
  }

  await connectDB();

  let uid = ADMIN_UID;
  let email = ADMIN_EMAIL || undefined;

  try {
    if (!uid) {
      if (!email) {
        throw new Error(
          "ADMIN_EMAIL is required when ADMIN_UID is not provided"
        );
      }
      // Lookup Firebase user by email
      const userRecord = await admin.auth().getUserByEmail(email);
      uid = userRecord.uid;
      email = userRecord.email || email;
      console.log(`[seedAdmin] Resolved UID ${uid} for email ${email}`);
    } else {
      // If uid provided, try to fetch email for completeness
      try {
        const userRecord = await admin.auth().getUser(uid);
        email = userRecord.email || email;
        console.log(
          `[seedAdmin] Found Firebase user for UID ${uid} (${
            email || "no-email"
          })`
        );
      } catch (e) {
        console.warn(
          `[seedAdmin] WARN: Could not fetch Firebase user for UID ${uid}. Proceeding with provided values.`
        );
      }
    }

    if (!uid) throw new Error("Could not determine admin UID");
    if (!email) throw new Error("Could not determine admin email");

    const update = {
      uid,
      email,
      role: "admin" as const,
      fullName: ADMIN_NAME,
      status: "active" as const,
    };

    const user = await User.findOneAndUpdate(
      { uid },
      { $set: update },
      { new: true, upsert: true }
    );

    console.log("[seedAdmin] Admin user upserted:", {
      id: user._id.toString(),
      uid: user.uid,
      email: user.email,
      role: user.role,
      status: user.status,
      fullName: user.fullName,
    });

    process.exit(0);
  } catch (err: any) {
    console.error("[seedAdmin] Failed:", err?.message || err);
    process.exit(1);
  }
}

main();
