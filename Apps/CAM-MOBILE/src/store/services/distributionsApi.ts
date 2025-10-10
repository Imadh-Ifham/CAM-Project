import { createApi } from "@reduxjs/toolkit/query/react";
import { apiBaseQuery } from "./baseApi";

function cleanParams(params: Record<string, any>) {
  const out: Record<string, any> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) out[k] = v;
  });
  return out;
}

export const distributionsApi = createApi({
  reducerPath: "distributionsApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["Distributions"],
  endpoints: (builder) => ({
    getDistributionsByCampaign: builder.query<
      Array<any>,
      { campaignId: string; status?: string; page?: number; limit?: number }
    >({
      query: ({ campaignId, ...params }) => ({
        url: `campaigns/${campaignId}/distributions`,
        params: cleanParams(params),
      }),
      providesTags: (_res, _err, arg) => [
        { type: "Distributions" as const, id: arg.campaignId },
        { type: "Distributions" as const, id: "LIST" },
      ],
      transformResponse: (resp: any) => {
        if (Array.isArray(resp)) return resp;
        if (Array.isArray(resp?.items)) return resp.items;
        if (Array.isArray(resp?.data?.items)) return resp.data.items;
        return Array.isArray(resp?.data) ? resp.data : [];
      },
    }),
    createDistributionJob: builder.mutation<
      any,
      {
        campaignId: string;
        resourceId: string;
        targetQty: number;
        resourceSnapshot?: {
          id: string;
          name?: string;
          unit?: string;
          targetQty?: number;
          category?: string;
          description?: string;
          availableQty?: number;
        };
        assignedVolunteerId?: string;
        receiverName?: string;
        receiverPhone?: string;
        deliveryInstructions?: string;
        destination?: {
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
        url: `campaigns/${campaignId}/distributions`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Distributions" as const, id: arg.campaignId },
        { type: "Distributions" as const, id: "LIST" },
      ],
    }),
    startDistributionJob: builder.mutation<
      any,
      { campaignId: string; id: string }
    >({
      query: ({ campaignId, id }) => ({
        url: `campaigns/${campaignId}/distributions/${id}/start`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Distributions" as const, id: arg.campaignId },
        { type: "Distributions" as const, id: "LIST" },
      ],
    }),
    completeDistributionJob: builder.mutation<
      any,
      { campaignId: string; id: string }
    >({
      query: ({ campaignId, id }) => ({
        url: `campaigns/${campaignId}/distributions/${id}/complete`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Distributions" as const, id: arg.campaignId },
        { type: "Distributions" as const, id: "LIST" },
      ],
    }),
    cancelDistributionJob: builder.mutation<
      any,
      { campaignId: string; id: string }
    >({
      query: ({ campaignId, id }) => ({
        url: `campaigns/${campaignId}/distributions/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Distributions" as const, id: arg.campaignId },
        { type: "Distributions" as const, id: "LIST" },
      ],
    }),
    scheduleDistributionJob: builder.mutation<
      any,
      {
        campaignId: string;
        id: string;
        schedule: { plannedStartAt?: string; plannedEndAt?: string };
      }
    >({
      query: ({ campaignId, id, schedule }) => ({
        url: `campaigns/${campaignId}/distributions/${id}/schedule`,
        method: "PATCH",
        body: schedule,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Distributions" as const, id: arg.campaignId },
        { type: "Distributions" as const, id: "LIST" },
      ],
    }),
    reserveDistributionStock: builder.mutation<
      any,
      { campaignId: string; id: string; qty: number }
    >({
      query: ({ campaignId, id, qty }) => ({
        url: `campaigns/${campaignId}/distributions/${id}/reserve`,
        method: "POST",
        body: { qty },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Distributions" as const, id: arg.campaignId },
        { type: "Distributions" as const, id: "LIST" },
      ],
    }),
    updateDistributionProgress: builder.mutation<
      any,
      { campaignId: string; id: string; deliveredQty: number }
    >({
      query: ({ campaignId, id, deliveredQty }) => ({
        url: `campaigns/${campaignId}/distributions/${id}/progress`,
        method: "POST",
        body: { deliveredQty },
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Distributions" as const, id: arg.campaignId },
        { type: "Distributions" as const, id: "LIST" },
      ],
    }),
    getDistributionJobRecords: builder.query<
      Array<{
        volunteerId?: string;
        volunteerName?: string;
        amountSubmitted: number;
        completedQtyAfter: number;
        targetQtySnapshot: number;
        recordedAt: string;
        note?: string;
      }>,
      { campaignId: string; id: string }
    >({
      query: ({ campaignId, id }) => ({
        url: `campaigns/${campaignId}/distributions/${id}/records`,
        method: "GET",
      }),
      providesTags: (_res, _err, arg) => [
        { type: "Distributions" as const, id: arg.campaignId },
      ],
      transformResponse: (resp: any) =>
        Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [],
    }),
    createDistributionJobRecord: builder.mutation<
      any,
      {
        campaignId: string;
        id: string;
        volunteerId?: string;
        volunteerName?: string;
        amountSubmitted: number;
        note?: string;
      }
    >({
      query: ({ campaignId, id, ...body }) => ({
        url: `campaigns/${campaignId}/distributions/${id}/records`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Distributions" as const, id: arg.campaignId },
      ],
    }),
  }),
});

export const {
  useGetDistributionsByCampaignQuery,
  useCreateDistributionJobMutation,
  useStartDistributionJobMutation,
  useCompleteDistributionJobMutation,
  useCancelDistributionJobMutation,
  useScheduleDistributionJobMutation,
  useReserveDistributionStockMutation,
  useUpdateDistributionProgressMutation,
  useGetDistributionJobRecordsQuery,
  useCreateDistributionJobRecordMutation,
} = distributionsApi;
