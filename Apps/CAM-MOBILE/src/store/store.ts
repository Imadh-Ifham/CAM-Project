// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import campaignReducer from "./slices/campaignSlice";
import agentReducer from "./slices/agentSlice";
import { campaignsApi } from "./services/campaignsApi";
import { collectionsApi } from "./services/collectionsApi";
import { distributionsApi } from "./services/distributionsApi";
import { progressApi } from "./services/progressApi";

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
    agent: agentReducer,
    [campaignsApi.reducerPath]: campaignsApi.reducer,
    [collectionsApi.reducerPath]: collectionsApi.reducer,
    [distributionsApi.reducerPath]: distributionsApi.reducer,
    [progressApi.reducerPath]: progressApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      campaignsApi.middleware,
      collectionsApi.middleware,
      distributionsApi.middleware,
      progressApi.middleware
    ),
});

// For TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
