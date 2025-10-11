import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/src/services/firebase";
import { Platform } from "react-native";
import Constants from "expo-constants";

function resolveBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) return envUrl.trim();
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
  return "http://localhost:5000";
}

// Compute base URL with /api suffix
const RAW_URL = resolveBaseUrl();
let resolvedHost = RAW_URL;
if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\\d+)?$/i.test(RAW_URL)) {
  if (Platform.OS === "android") {
    const port = RAW_URL.split(":").pop() || "5000";
    resolvedHost = `http://10.0.2.2:${port}`;
  }
}
export const API_BASE_URL = `${resolvedHost}/api`;

export const apiBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers) => {
    const user: any = (auth as any).currentUser;
    if (user) {
      try {
        const token = await user.getIdToken?.(true);
        if (token) headers.set("Authorization", `Bearer ${token}`);
      } catch {}
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});
