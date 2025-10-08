import { withAuthHeaders } from "./auth";
import API from "./API";

/**
 * Fetch with timeout wrapper
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Network request timed out");
    }
    throw error;
  }
}

/**
 * Get all campaigns
 */
export async function getCampaigns() {
  const res = await fetchWithTimeout(API.CAMPAIGN.LIST_CAMPAIGNS, await withAuthHeaders());
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    const msg = (body as any)?.message || `Failed to fetch campaigns`;
    throw new Error(msg);
  }
  return res.json();
}

/**
 * Get single campaign by ID
 */
export async function getCampaign(id: string) {
  const res = await fetchWithTimeout(API.CAMPAIGN.GET_CAMPAIGN(id), await withAuthHeaders());
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    const msg = (body as any)?.message || `Failed to fetch campaign`;
    throw new Error(msg);
  }
  return res.json();
}

/**
 * Create new campaign (for agents)
 */
export async function createCampaign(data: any) {
  const res = await fetchWithTimeout(
    API.CAMPAIGN.CREATE_CAMPAIGN,
    await withAuthHeaders({
      method: "POST",
      body: JSON.stringify(data),
    })
  );
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    const msg = (body as any)?.message || `Failed to create campaign`;
    throw new Error(msg);
  }
  return res.json();
}

/**
 * Join a campaign as volunteer
 */
export async function joinCampaign(campaignId: string, volunteerId: string, role?: string) {
  const res = await fetchWithTimeout(
    API.VOLUNTEER.ASSIGN_TO_CAMPAIGN,
    await withAuthHeaders({
      method: "POST",
      body: JSON.stringify({ campaignId, volunteerId, role }),
    })
  );
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    const msg = (body as any)?.message || `Failed to join campaign`;
    throw new Error(msg);
  }
  return res.json();
}
