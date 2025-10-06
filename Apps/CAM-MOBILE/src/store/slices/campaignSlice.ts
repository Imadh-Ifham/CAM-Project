import { Campaign, mockCampaignDetail } from "@/src/types/campaign.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CampaignState {
  campaignList: Campaign[] | null;
  selectedCampaign: Campaign;
}

const initialState: CampaignState = {
  campaignList: null,
  selectedCampaign: mockCampaignDetail,
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setSelectedCampaign: (state, action: PayloadAction<Campaign>) => {
      state.selectedCampaign = action.payload;
    },
    clearSelectedCampaign: (state) => {
      state.selectedCampaign = mockCampaignDetail;
    },
  },
});

export const { setSelectedCampaign, clearSelectedCampaign } =
  campaignSlice.actions;

// Selectors
export const selectCampaignList = (state: { campaign: CampaignState }) =>
  state.campaign.campaignList;
export const selectSelectedCampaign = (state: { campaign: CampaignState }) =>
  state.campaign.selectedCampaign;
export default campaignSlice.reducer;
