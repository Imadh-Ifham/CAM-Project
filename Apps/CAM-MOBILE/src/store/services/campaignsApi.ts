import { createApi } from "@reduxjs/toolkit/query/react";
import { apiBaseQuery } from "./baseApi";

// BaseQuery moved to shared baseApi

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
  baseQuery: apiBaseQuery,
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
        // Also invalidate admin pending list so it refetches quickly within the same session
        { type: "AgentRequests" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useLazyGetCampaignByIdQuery,
  useJoinCampaignMutation,
  useGetMeQuery,
  useGetPendingAgentRequestsQuery,
  useApproveAgentRequestMutation,
  useRejectAgentRequestMutation,
  useGetCoordinatorAssignmentQuery,
  useGetCoordinatorAssignmentsQuery,
  // Lazy variants for prefetching before navigation
  useLazyGetCoordinatorAssignmentQuery,
} = campaignsApi;
