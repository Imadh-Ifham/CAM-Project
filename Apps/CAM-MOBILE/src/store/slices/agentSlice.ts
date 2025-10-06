import { Campaign, mockCampaignDetail } from "@/src/types/campaign.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, store } from "../store";

interface AgentState {
  name: String;
}

const initialState: AgentState = {
  name: "null",
};

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {},
});

export const {} = agentSlice.actions;

// Selectors
export const selectName = (state: RootState) => state.agent.name;

export default agentSlice.reducer;
