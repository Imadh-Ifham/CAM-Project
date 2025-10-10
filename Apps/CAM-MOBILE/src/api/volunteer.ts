import { auth } from "../services/firebase";
import Constants from "expo-constants";
import { Platform } from "react-native";

function resolveBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) return envUrl.trim();

  if (Platform.OS !== "web") {
    const hostUri = (Constants as any)?.expoConfig?.hostUri as string | undefined;
    if (hostUri) {
      const host = hostUri.split(":")[0];
      if (host && /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
        return `http://${host}:5000`;
      }
    }
  }
  return "http://localhost:5000";
}

const BASE_URL = resolveBaseUrl();

async function throwIfNotOk(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    const msg = (body as any)?.message || `Request failed with status ${res.status}`;
    throw new Error(msg);
  }
}

async function withAuthHeaders(init?: RequestInit): Promise<RequestInit> {
  const user = (auth as any).currentUser;
  const token = user ? await user.getIdToken(true) : undefined;
  return {
    ...(init || {}),
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

/**
 * Get volunteer profile (authenticated)
 */
export async function getVolunteerProfile() {
  const res = await fetch(
    `${BASE_URL}/api/volunteer/auth/me`,
    await withAuthHeaders()
  );
  await throwIfNotOk(res);
  return res.json();
}

/**
 * Update volunteer profile details
 */
export async function updateVolunteerProfile(data: {
  fullName?: string;
  age?: number;
  phoneNumber?: string;
  skillsAndInterest?: string;
  availability?: string;
}) {
  const res = await fetch(
    `${BASE_URL}/api/volunteer/auth/me`,
    await withAuthHeaders({
      method: "PUT",
      body: JSON.stringify(data),
    })
  );
  await throwIfNotOk(res);
  return res.json();
}
