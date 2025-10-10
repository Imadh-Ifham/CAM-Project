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

class HTTPError extends Error {
  status: number;
  url: string;
  body?: any;
  constructor(message: string, opts: { status: number; url: string; body?: any }) {
    super(message);
    this.name = "HTTPError";
    this.status = opts.status;
    this.url = opts.url;
    this.body = opts.body;
  }
}

async function throwIfNotOk(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    const msg = (body as any)?.message || `Request failed with status ${res.status}`;
    throw new HTTPError(msg, { status: res.status, url: res.url, body });
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
 * Get all campaigns
 */
export async function getCampaigns() {
  const res = await fetch(
    `${BASE_URL}/api/campaign/campaigns`,
    await withAuthHeaders()
  );
  await throwIfNotOk(res);
  return res.json();
}

/**
 * Get single campaign by ID
 */
export async function getCampaign(campaignId: string) {
  const res = await fetch(
    `${BASE_URL}/api/campaign/campaigns/${campaignId}`,
    await withAuthHeaders()
  );
  await throwIfNotOk(res);
  return res.json();
}

/**
 * Join a campaign as volunteer
 */
export async function joinCampaign(
  campaignId: string,
  volunteerId: string,
  role: string = "volunteer"
) {
  const res = await fetch(
    `${BASE_URL}/api/volunteer/assign`,
    await withAuthHeaders({
      method: "POST",
      body: JSON.stringify({ campaignId, volunteerId, role }),
    })
  );
  await throwIfNotOk(res);
  return res.json();
}

/**
 * Create new campaign (for agents/admins)
 */
export async function createCampaign(campaignData: any) {
  const res = await fetch(
    `${BASE_URL}/api/campaign/campaigns`,
    await withAuthHeaders({
      method: "POST",
      body: JSON.stringify(campaignData),
    })
  );
  await throwIfNotOk(res);
  return res.json();
}
