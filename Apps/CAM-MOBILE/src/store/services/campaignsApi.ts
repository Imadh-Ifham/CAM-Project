import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/src/services/firebase";
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
  // Team relations
  requestedAgent?: string[];
  coordinatorAgentId?: string;
};

// Minimal shape for authenticated user response
export type ServerMe = {
  user?: {
    uid?: string;
    email?: string;
    role?: string;
    agentId?: string;
  };
  // Some backends may return fields at the root
  uid?: string;
  email?: string;
  role?: string;
  agentId?: string;
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
  }),
  tagTypes: ["Campaign", "AgentRequests", "Assignment", "AssignmentsList"],
  endpoints: (builder) => ({
    // Admin: list coordinator assignments (active coordinators)
    getCoordinatorAssignments: builder.query<
      Array<{
        campaignId: string;
        agentId: string;
        status: string;
        startedAt?: string;
        campaign?: {
          name?: string;
          city?: string;
          district?: string;
          type?: string;
        };
        coordinatorProfile?: {
          fullName?: string;
          email?: string;
          phoneNumber?: string;
        };
        stats?: {
          collections?: { completed?: number; target?: number };
          distributions?: { completed?: number; target?: number };
        };
      }>,
      { status?: string; page?: number; limit?: number } | void
    >({
      query: (args) => ({
        url: `campaigns/assignments`,
        params: cleanParams(args || {}),
      }),
      providesTags: [{ type: "AssignmentsList", id: "LIST" }],
      transformResponse: (resp: any) => {
        if (Array.isArray(resp)) return resp;
        if (Array.isArray(resp?.data)) return resp.data;
        return [];
      },
    }),
    // Admin: list pending agent requests
    getPendingAgentRequests: builder.query<
      Array<{
        _id: string;
        agentId: string;
        campaignId: string;
        status: string;
        experience?: string;
        motivation?: string;
        availability?: string;
        createdAt: string;
        agent?: {
          agentId?: string;
          fullName?: string;
          email?: string;
          phoneNumber?: string;
        } | null;
        campaign?: {
          campaignID: string;
          name: string;
          type?: string;
          city?: string;
          district?: string;
          status?: string;
        } | null;
      }>,
      { campaignId?: string; page?: number; limit?: number } | void
    >({
      query: (args) => ({
        url: `campaigns/agent-requests`,
        params: cleanParams(args || {}),
      }),
      providesTags: (result) => [{ type: "AgentRequests", id: "LIST" }],
      transformResponse: (resp: any) => {
        if (Array.isArray(resp)) return resp;
        if (Array.isArray(resp?.data)) return resp.data;
        return [];
      },
    }),
    // Admin: approve agent request
    approveAgentRequest: builder.mutation<
      {
        campaign: any;
        approvedRequest: any;
        assignment: any;
        campaignRelation?: {
          hasCoordinator: boolean;
          coordinatorAgentId: string;
        };
      },
      { campaignId: string; agentId: string; requestId?: string }
    >({
      query: ({ campaignId, ...body }) => ({
        url: `campaigns/${campaignId}/approve-agent`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Campaign" as const, id: arg.campaignId },
        { type: "Campaign" as const, id: "LIST" },
        { type: "AgentRequests" as const, id: "LIST" },
        { type: "Assignment" as const, id: arg.campaignId },
        { type: "AssignmentsList" as const, id: "LIST" },
      ],
    }),
    // Admin: reject agent request
    rejectAgentRequest: builder.mutation<
      { success: boolean },
      { campaignId: string; requestId?: string; agentId?: string }
    >({
      query: ({ campaignId, ...body }) => ({
        url: `campaigns/${campaignId}/reject-request`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "AgentRequests" as const, id: "LIST" },
        { type: "Campaign" as const, id: arg.campaignId },
      ],
    }),
    // Agent/Admin: get assignment by campaign
    getCoordinatorAssignment: builder.query<any, string>({
      query: (campaignId) => ({ url: `campaigns/${campaignId}/assignment` }),
      providesTags: (_res, _err, id) => [{ type: "Assignment", id }],
      transformResponse: (resp: any) => resp?.data ?? resp,
    }),
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
    getMe: builder.query<ServerMe, void>({
      query: () => ({ url: "auth/me" }),
      transformResponse: (resp: any) => {
        // Accept a few common shapes
        if (resp?.data?.user) return resp.data as ServerMe;
        if (resp?.data) return resp.data as ServerMe;
        return resp as ServerMe;
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
    joinCampaign: builder.mutation<
      {
        request: any;
        campaignRelation: {
          requestedAgentCount: number;
          hasCoordinator: boolean;
          isRequested: boolean;
        };
      },
      {
        campaignId: string;
        experience?: string;
        motivation?: string;
        availability?: string;
      }
    >({
      query: ({ campaignId, ...body }) => ({
        url: `campaigns/${campaignId}/join-requests`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Campaign" as const, id: arg.campaignId },
        { type: "Campaign" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useJoinCampaignMutation,
  useGetMeQuery,
  useGetPendingAgentRequestsQuery,
  useApproveAgentRequestMutation,
  useRejectAgentRequestMutation,
  useGetCoordinatorAssignmentQuery,
  useGetCoordinatorAssignmentsQuery,
} = campaignsApi;
