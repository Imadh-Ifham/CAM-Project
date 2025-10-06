// src/features/userSlice.ts
import { Campaign } from "@/src/types/campaign.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CampaignState {
  campaign: Campaign | null;
}

const initialState: CampaignState = {
  campaign: null,
};

const campaignSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Campaign>) => {
      state.campaign = action.payload;
    },
    clearUser: (state) => {
      state.campaign = null;
    },
  },
});

export const { setUser, clearUser } = campaignSlice.actions;
export default campaignSlice.reducer;
