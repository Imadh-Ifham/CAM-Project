import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Platform } from "react-native";
import Constants from "expo-constants";

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
  // Fallback
  return "http://localhost:5000";
}

// Keep base URL consistent with backend (defaults to port 5000)
const RAW_URL = resolveBaseUrl();
// Handle Android emulator 'localhost' redirection
let resolvedHost = RAW_URL;
if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\\d+)?$/i.test(RAW_URL)) {
  if (Platform.OS === "android") {
    // Android emulator needs 10.0.2.2 to reach host machine
    const port = RAW_URL.split(":").pop() || "5000";
    resolvedHost = `http://10.0.2.2:${port}`;
  }
}
const BASE_URL = `${resolvedHost}/api`;

export type ServerCampaign = {
  campaignID: string;
  name: string;
  description: string;
  type:
    | "disaster-relief"
    | "medical-aid"
    | "education"
    | "food-distribution"
    | "emergency-response";
  status: "draft" | "active" | "paused" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  district: string;
  city: string;
  location?: string;
  resources: Array<{
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    estimatedCost: number;
    description?: string;
  }>;
  estimatedBudget: number;
  spent?: number;
  startDate: string;
  endDate: string;
  isUrgent: boolean;
  expectedDuration: number;
  requiredVolunteers: number;
  volunteers?: number;
};

export type GetCampaignsParams = {
  // Server-supported filters
  status?: string; // 'active' | 'paused' | 'completed' | 'draft' | 'cancelled'
  type?: string;
  priority?: string;
  district?: string;
  city?: string;
  isUrgent?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  // Forward-compatible (backend may ignore today)
  agentId?: string;
  assigned?: boolean;
  available?: boolean;
};

function cleanParams(params: Record<string, any>) {
  const out: Record<string, any> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) out[k] = v;
  });
  return out;
}

export const campaignsApi = createApi({
  reducerPath: "campaignsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["Campaign"],
  endpoints: (builder) => ({
    getCampaigns: builder.query<ServerCampaign[], GetCampaignsParams | void>({
      query: (args) => ({
        url: "campaigns",
        params: cleanParams(args || {}),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({
                type: "Campaign" as const,
                id: c.campaignID,
              })),
              { type: "Campaign" as const, id: "LIST" },
            ]
          : [{ type: "Campaign" as const, id: "LIST" }],
      transformResponse: (resp: any) => {
        // Controller returns { success, message, data, pagination }
        if (resp && Array.isArray(resp)) return resp as ServerCampaign[];
        if (resp && Array.isArray(resp?.data))
          return resp.data as ServerCampaign[];
        // Some setups may return directly an array
        return (resp?.data ?? []) as ServerCampaign[];
      },
    }),
    getCampaignById: builder.query<ServerCampaign, string>({
      query: (id) => ({ url: `campaigns/${id}` }),
      providesTags: (result, _err, id) => [{ type: "Campaign", id }],
      transformResponse: (resp: any) => {
        if (resp && resp.data) return resp.data as ServerCampaign;
        return resp as ServerCampaign;
      },
    }),
  }),
});

export const { useGetCampaignsQuery, useGetCampaignByIdQuery } = campaignsApi;
