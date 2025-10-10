import { RootState } from "../store";

// Campaign Selectors
export const selectCampaignList = (state: RootState) =>
  state.campaign.campaignList;

export const selectSelectedCampaign = (state: RootState) =>
  state.campaign.selectedCampaign;

export const selectCampaignFormData = (state: RootState) =>
  state.campaign.campaignFormData;
