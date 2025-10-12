import { createApi } from "@reduxjs/toolkit/query/react";
import { apiBaseQuery } from "./baseApi";

export type ProgressSnapshot = {
  campaignId: string;
  resourceId: string;
  targetQty: number;
  collectedQty: number;
  distributedQty: number;
  reservedQty: number;
  availableQty: number;
  updatedAt: string;
};

export const progressApi = createApi({
  reducerPath: "progressApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["Progress"],
  endpoints: (builder) => ({
    getCampaignSnapshots: builder.query<ProgressSnapshot[], string>({
      query: (campaignId) => ({ url: `progress/${campaignId}/snapshots` }),
      providesTags: (_res, _err, id) => [{ type: "Progress" as const, id }],
      transformResponse: (resp: any) => {
        // Accept common shapes: [], { data: [] }, { items: [] }, { data: { items: [] } }
        if (Array.isArray(resp)) return resp as ProgressSnapshot[];
        if (Array.isArray(resp?.data)) return resp.data as ProgressSnapshot[];
        if (Array.isArray(resp?.items)) return resp.items as ProgressSnapshot[];
        if (Array.isArray(resp?.data?.items))
          return resp.data.items as ProgressSnapshot[];
        return [] as ProgressSnapshot[];
      },
    }),
    getResourceSnapshot: builder.query<
      ProgressSnapshot | null,
      { campaignId: string; resourceId: string }
    >({
      query: ({ campaignId, resourceId }) => ({
        url: `progress/${campaignId}/resources/${resourceId}/snapshot`,
      }),
      providesTags: (_res, _err, arg) => [
        {
          type: "Progress" as const,
          id: `${arg.campaignId}:${arg.resourceId}`,
        },
      ],
      transformResponse: (resp: any) => {
        // Handle several API shapes robustly
        if (resp == null) return null;
        if (
          resp?.data &&
          typeof resp.data === "object" &&
          !Array.isArray(resp.data)
        )
          return resp.data as ProgressSnapshot;
        if (Array.isArray(resp?.data))
          return resp.data[0] ? (resp.data[0] as ProgressSnapshot) : null;
        if (Array.isArray(resp))
          return resp[0] ? (resp[0] as ProgressSnapshot) : null;
        if (resp?.item && typeof resp.item === "object")
          return resp.item as ProgressSnapshot;
        return resp as ProgressSnapshot;
      },
    }),
  }),
});

export const { useGetCampaignSnapshotsQuery, useGetResourceSnapshotQuery } =
  progressApi;
