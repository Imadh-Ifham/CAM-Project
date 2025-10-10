import { createApi } from "@reduxjs/toolkit/query/react";
import { apiBaseQuery } from "./baseApi";

function cleanParams(params: Record<string, any>) {
  const out: Record<string, any> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) out[k] = v;
  });
  return out;
}

export const collectionsApi = createApi({
  reducerPath: "collectionsApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["Collections"],
  endpoints: (builder) => ({
    getCollectionsByCampaign: builder.query<
      Array<any>,
      { campaignId: string; status?: string; page?: number; limit?: number }
    >({
      query: ({ campaignId, ...params }) => ({
        url: `campaigns/${campaignId}/collections`,
        params: cleanParams(params),
      }),
      providesTags: (_res, _err, arg) => [
        { type: "Collections" as const, id: arg.campaignId },
        { type: "Collections" as const, id: "LIST" },
      ],
      transformResponse: (resp: any) => {
        if (Array.isArray(resp)) return resp;
        if (Array.isArray(resp?.items)) return resp.items;
        if (Array.isArray(resp?.data?.items)) return resp.data.items;
        return [] as any[];
      },
    }),
    createCollectionJob: builder.mutation<
      any,
      {
        campaignId: string;
        resourceId: string;
        targetQty: number;
        assignedVolunteerId?: string;
        pickup?: {
          locationName?: string;
          address?: string;
          lat?: number;
          lng?: number;
          contactName?: string;
          contactPhone?: string;
        };
        schedule?: {
          plannedStartAt?: string;
          plannedEndAt?: string;
        };
        notes?: string;
      }
    >({
      query: ({ campaignId, ...body }) => ({
        url: `campaigns/${campaignId}/collections`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Collections" as const, id: arg.campaignId },
        { type: "Collections" as const, id: "LIST" },
      ],
    }),
    startCollectionJob: builder.mutation<
      any,
      { campaignId: string; jobId: string }
    >({
      query: ({ campaignId, jobId }) => ({
        url: `campaigns/${campaignId}/collections/${jobId}/start`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Collections" as const, id: arg.campaignId },
        { type: "Collections" as const, id: "LIST" },
      ],
    }),
    completeCollectionJob: builder.mutation<
      any,
      { campaignId: string; jobId: string; actualQty?: number }
    >({
      query: ({ campaignId, jobId, actualQty }) => ({
        url: `campaigns/${campaignId}/collections/${jobId}/complete`,
        method: "POST",
        body: actualQty !== undefined ? { actualQty } : {},
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Collections" as const, id: arg.campaignId },
        { type: "Collections" as const, id: "LIST" },
      ],
    }),
    updateCollectionJob: builder.mutation<
      any,
      { campaignId: string; jobId: string; patch: Record<string, any> }
    >({
      query: ({ campaignId, jobId, patch }) => ({
        url: `campaigns/${campaignId}/collections/${jobId}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Collections" as const, id: arg.campaignId },
        { type: "Collections" as const, id: "LIST" },
      ],
    }),
    cancelCollectionJob: builder.mutation<
      any,
      { campaignId: string; jobId: string }
    >({
      query: ({ campaignId, jobId }) => ({
        url: `campaigns/${campaignId}/collections/${jobId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Collections" as const, id: arg.campaignId },
        { type: "Collections" as const, id: "LIST" },
      ],
    }),
    getCollectionJobRecords: builder.query<
      Array<{
        volunteerId?: string;
        volunteerName?: string;
        amountSubmitted: number;
        completedQtyAfter: number;
        targetQtySnapshot: number;
        recordedAt: string;
        note?: string;
      }>,
      { campaignId: string; jobId: string }
    >({
      query: ({ campaignId, jobId }) => ({
        url: `campaigns/${campaignId}/collections/${jobId}/records`,
        method: "GET",
      }),
      providesTags: (_res, _err, arg) => [
        { type: "Collections" as const, id: arg.campaignId },
      ],
      transformResponse: (resp: any) =>
        Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [],
    }),
    createCollectionJobRecord: builder.mutation<
      any,
      {
        campaignId: string;
        jobId: string;
        volunteerId?: string;
        volunteerName?: string;
        amountSubmitted: number;
        note?: string;
      }
    >({
      query: ({ campaignId, jobId, ...body }) => ({
        url: `campaigns/${campaignId}/collections/${jobId}/records`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Collections" as const, id: arg.campaignId },
      ],
    }),
  }),
});

export const {
  useGetCollectionsByCampaignQuery,
  useCreateCollectionJobMutation,
  useStartCollectionJobMutation,
  useCompleteCollectionJobMutation,
  useUpdateCollectionJobMutation,
  useCancelCollectionJobMutation,
  useGetCollectionJobRecordsQuery,
  useCreateCollectionJobRecordMutation,
} = collectionsApi;
