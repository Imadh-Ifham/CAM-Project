import { auth } from "../services/firebase";
import * as firebaseAuth from "firebase/auth";
import Constants from "expo-constants";
import { Platform } from "react-native";

function resolveBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) return envUrl.trim();
  // In Expo dev, derive LAN host to avoid using localhost on device
  if (Platform.OS !== "web") {
    const hostUri = (Constants as any)?.expoConfig?.hostUri as
      | string
      | undefined;
    if (hostUri) {
      const host = hostUri.split(":")[0];
      if (host && /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
        return `http://${host}:5000`;
      }
    }
  }
  // Fallback for web or when host cannot be derived
  return "http://localhost:5000";
}

const BASE_URL = resolveBaseUrl();

class HTTPError extends Error {
  status: number;
  url: string;
  body?: any;
  constructor(
    message: string,
    opts: { status: number; url: string; body?: any }
  ) {
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
    const msg =
      (body as any)?.message || `Request failed with status ${res.status}`;
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

export async function registerAgent(payload: {
  fullName: string;
  email: string;
  phoneNumber: string;
  organization?: string;
  password: string;
  experienceAndMotivation?: string;
}) {
  // 1) Check if email already has password method; if yes, try sign-in instead of create
  const methods: string[] = await (firebaseAuth as any)
    .fetchSignInMethodsForEmail(auth, payload.email)
    .catch(() => []);

  let idToken: string | null = null;
  if (methods?.includes("password")) {
    // Email exists. Attempt sign-in with provided password to continue registration flow.
    try {
      const signInCred = await (firebaseAuth as any).signInWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );
      idToken = await signInCred.user.getIdToken(true);
    } catch (e: any) {
      // Provide clear guidance if password mismatch
      e.signInMethods = methods;
      e.code = e?.code || "auth/email-already-in-use";
      e.message =
        e?.message ||
        "This email is already registered. Please log in with the correct password.";
      throw e;
    }
  } else {
    // 2) Create Firebase user
    let cred: any;
    try {
      cred = await (firebaseAuth as any).createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );
    } catch (e: any) {
      // Enhance error with sign-in methods for this email if possible
      try {
        const methods2 = await (firebaseAuth as any).fetchSignInMethodsForEmail(
          auth,
          payload.email
        );
        (e as any).signInMethods = methods2;
      } catch {}
      throw e;
    }
    idToken = await cred.user.getIdToken(true);
  }

  const token = idToken!;
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
  await throwIfNotOk(res);
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
  const methods: string[] = await (firebaseAuth as any)
    .fetchSignInMethodsForEmail(auth, payload.email)
    .catch(() => []);

  let idToken: string | null = null;
  if (methods?.includes("password")) {
    try {
      const signInCred = await (firebaseAuth as any).signInWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );
      idToken = await signInCred.user.getIdToken(true);
    } catch (e: any) {
      e.signInMethods = methods;
      e.code = e?.code || "auth/email-already-in-use";
      e.message =
        e?.message ||
        "This email is already registered. Please log in with the correct password.";
      throw e;
    }
  } else {
    let cred: any;
    try {
      cred = await (firebaseAuth as any).createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );
    } catch (e: any) {
      try {
        const methods2 = await (firebaseAuth as any).fetchSignInMethodsForEmail(
          auth,
          payload.email
        );
        (e as any).signInMethods = methods2;
      } catch {}
      throw e;
    }
    idToken = await cred.user.getIdToken(true);
  }

  const token = idToken!;
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
  await throwIfNotOk(res);
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
  await throwIfNotOk(res);
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${BASE_URL}/api/auth/me`, await withAuthHeaders());
  await throwIfNotOk(res);
  return res.json();
}

export async function logout() {
  try {
    await (firebaseAuth as any).signOut(auth);
  } catch (e) {
    // best-effort sign out
    console.warn("logout() failed", e);
  }
}
