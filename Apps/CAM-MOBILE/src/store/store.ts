// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import campaignReducer from "./slices/campaignSlice";
import agentReducer from "./slices/agentSlice";
import { campaignsApi } from "./services/campaignsApi";

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
    agent: agentReducer,
    [campaignsApi.reducerPath]: campaignsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(campaignsApi.middleware),
});

// For TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
