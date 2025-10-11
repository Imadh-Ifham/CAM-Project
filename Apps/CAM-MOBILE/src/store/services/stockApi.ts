import { createApi } from "@reduxjs/toolkit/query/react";
import { apiBaseQuery } from "./baseApi";

export type StockTotals = Array<{
  resourceId: string;
  totalQuantity: number;
  totalConsumed: number;
  totalAvailable: number;
}>;

export const stockApi = createApi({
  reducerPath: "stockApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["Stock"],
  endpoints: (builder) => ({
    getTotals: builder.query<StockTotals, string>({
      query: (campaignId) => ({ url: `stock/${campaignId}/totals` }),
      providesTags: (_res, _err, id) => [{ type: "Stock" as const, id }],
      transformResponse: (resp: any) =>
        (Array.isArray(resp?.data) ? resp.data : []) as StockTotals,
    }),
    getLots: builder.query<any[], { campaignId: string; resourceId?: string }>({
      query: ({ campaignId, resourceId }) => ({
        url: `stock/${campaignId}/lots`,
        params: resourceId ? { resourceId } : undefined,
      }),
      providesTags: (_res, _err, arg) => [
        { type: "Stock" as const, id: arg.campaignId },
      ],
      transformResponse: (resp: any) =>
        (Array.isArray(resp?.data) ? resp.data : []) as any[],
    }),
  }),
});

export const { useGetTotalsQuery, useGetLotsQuery } = stockApi;
