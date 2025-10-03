import { auth } from "../services/firebase";
import * as firebaseAuth from "firebase/auth";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

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

export async function registerAgent(payload: {
  fullName: string;
  email: string;
  phoneNumber: string;
  organization?: string;
  password: string;
  experienceAndMotivation?: string;
}) {
  // 1) Create Firebase user
  const cred = await (firebaseAuth as any).createUserWithEmailAndPassword(
    auth,
    payload.email,
    payload.password
  );
  // 2) Force fresh token from the new user and send to backend immediately
  const token = await cred.user.getIdToken(true);
  const res = await fetch(`${BASE_URL}/api/agent/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fullName: payload.fullName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      organization: payload.organization,
      experienceAndMotivation: payload.experienceAndMotivation,
    }),
  });
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({}))).message ||
        "Agent registration failed"
    );
  return res.json();
}

export async function registerVolunteer(payload: {
  fullName: string;
  age?: number;
  email: string;
  phoneNumber: string;
  password: string;
  skillsAndInterest?: string;
  availability?: string;
}) {
  const cred = await (firebaseAuth as any).createUserWithEmailAndPassword(
    auth,
    payload.email,
    payload.password
  );
  const token = await cred.user.getIdToken(true);
  const res = await fetch(`${BASE_URL}/api/volunteer/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fullName: payload.fullName,
      age: payload.age,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      skillsAndInterest: payload.skillsAndInterest,
      availability: payload.availability,
    }),
  });
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({}))).message ||
        "Volunteer registration failed"
    );
  return res.json();
}

export async function login(payload: { email: string; password: string }) {
  await (firebaseAuth as any).signInWithEmailAndPassword(
    auth,
    payload.email,
    payload.password
  );
  // Optionally fetch profile
  const res = await fetch(`${BASE_URL}/api/auth/me`, await withAuthHeaders());
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({}))).message || "Failed to fetch profile"
    );
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${BASE_URL}/api/auth/me`, await withAuthHeaders());
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({}))).message || "Failed to fetch profile"
    );
  return res.json();
}
