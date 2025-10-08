import { withAuthHeaders } from "./auth";
import API from "./API";

/**
 * Get volunteer profile (authenticated)
 */
export async function getVolunteerProfile() {
  const res = await fetch(API.VOLUNTEER.PROFILE, await withAuthHeaders());
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    const msg = (body as any)?.message || `Failed to fetch profile`;
    throw new Error(msg);
  }
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
    API.VOLUNTEER.PROFILE,
    await withAuthHeaders({
      method: "PUT",
      body: JSON.stringify(data),
    })
  );
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    const msg = (body as any)?.message || `Failed to update profile`;
    throw new Error(msg);
  }
  return res.json();
}
