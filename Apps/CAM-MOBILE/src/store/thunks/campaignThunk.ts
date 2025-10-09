import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CampaignFormData, Campaign } from "@/src/types/campaign.type";
import API from "@/src/api/API";

/**
 * Create a new campaign
 * Takes CampaignFormData as input and returns the created Campaign
 */
export const createCampaignThunk = createAsyncThunk<
  Campaign, // Return type
  { campaignData: CampaignFormData }, // Argument type
  { rejectValue: string } // Error type
>("campaign/createCampaign", async ({ campaignData }, { rejectWithValue }) => {
  try {
    console.log("Creating campaign with data:", campaignData);

    const response = await axios.post(
      `${API.CAMPAIGN.CREATE_CAMPAIGN}`,
      campaignData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Campaign created successfully:", response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating campaign:", error);

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error: ${error.response.status}`;
      return rejectWithValue(errorMessage);
    } else if (error.request) {
      // Network error
      return rejectWithValue("Network error: Unable to connect to server");
    } else {
      // Other error
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  }
});

/**
 * Fetch all campaigns
 */
export const fetchCampaignsThunk = createAsyncThunk<
  Campaign[],
  { token: string },
  { rejectValue: string }
>("campaign/fetchCampaigns", async ({ token }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API.CAMPAIGN}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching campaigns:", error);

    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error: ${error.response.status}`;
      return rejectWithValue(errorMessage);
    } else if (error.request) {
      return rejectWithValue("Network error: Unable to connect to server");
    } else {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  }
});

/**
 * Fetch campaign by ID
 */
export const fetchCampaignByIdThunk = createAsyncThunk<
  Campaign,
  { campaignId: string; token: string },
  { rejectValue: string }
>(
  "campaign/fetchCampaignById",
  async ({ campaignId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API.CAMPAIGN}/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Error fetching campaign by ID:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
        return rejectWithValue(errorMessage);
      } else if (error.request) {
        return rejectWithValue("Network error: Unable to connect to server");
      } else {
        return rejectWithValue(error.message || "An unexpected error occurred");
      }
    }
  }
);
