import {
  Campaign,
  CampaignFormData,
  initialCampaignFormData,
  mockCampaignDetail,
} from "@/src/types/campaign.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CampaignState {
  campaignList: Campaign[] | null;
  selectedCampaign: Campaign;
  campaignFormData: CampaignFormData;
}

const initialState: CampaignState = {
  campaignList: null,
  selectedCampaign: mockCampaignDetail,
  campaignFormData: initialCampaignFormData,
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
    updateFormData: (
      state,
      action: PayloadAction<Partial<CampaignFormData>>
    ) => {
      state.campaignFormData = { ...state.campaignFormData, ...action.payload };
    },
  },
});

export const { setSelectedCampaign, clearSelectedCampaign, updateFormData } =
  campaignSlice.actions;

export default campaignSlice.reducer;
