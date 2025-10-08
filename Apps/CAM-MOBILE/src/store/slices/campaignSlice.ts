import {
  Campaign,
  CampaignFormData,
  initialCampaignFormData,
  mockCampaignDetail,
} from "@/src/types/campaign.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createCampaignThunk,
  fetchCampaignsThunk,
  fetchCampaignByIdThunk,
} from "../thunks/campaignThunk";

interface CampaignState {
  campaignList: Campaign[] | null;
  selectedCampaign: Campaign;
  campaignFormData: CampaignFormData;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
}

const initialState: CampaignState = {
  campaignList: null,
  selectedCampaign: mockCampaignDetail,
  campaignFormData: initialCampaignFormData,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
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
    resetFormData: (state) => {
      state.campaignFormData = initialCampaignFormData;
    },
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    // Create Campaign
    builder
      .addCase(createCampaignThunk.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createCampaignThunk.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createError = null;
        // Add the new campaign to the list if it exists
        if (state.campaignList) {
          state.campaignList.push(action.payload);
        }
        // Reset form data after successful creation
        state.campaignFormData = initialCampaignFormData;
      })
      .addCase(createCampaignThunk.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "Failed to create campaign";
      })

      // Fetch Campaigns
      .addCase(fetchCampaignsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.campaignList = action.payload;
      })
      .addCase(fetchCampaignsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch campaigns";
      })

      // Fetch Campaign by ID
      .addCase(fetchCampaignByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedCampaign = action.payload;
      })
      .addCase(fetchCampaignByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch campaign";
      });
  },
});

export const {
  setSelectedCampaign,
  clearSelectedCampaign,
  updateFormData,
  resetFormData,
  clearErrors,
} = campaignSlice.actions;

export default campaignSlice.reducer;
