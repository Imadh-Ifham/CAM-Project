import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "inactive" | "busy";
  location: string;
  skills: string[];
  assignedCampaigns: string[];
}

interface AgentState {
  currentAgent: Agent | null;
  agentList: Agent[];
  isLoading: boolean;
  error: string | null;
  selectedAgentId: string | null;
}

const mockAgent: Agent = {
  id: "agent-1",
  name: "John Doe",
  email: "john.doe@cam.lk",
  phone: "+94 77 123 4567",
  role: "Field Agent",
  status: "active",
  location: "Colombo",
  skills: ["Emergency Response", "Medical Aid", "Logistics"],
  assignedCampaigns: ["campaign-1", "campaign-2"],
};

const initialState: AgentState = {
  currentAgent: mockAgent,
  agentList: [mockAgent],
  isLoading: false,
  error: null,
  selectedAgentId: null,
};

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    setCurrentAgent: (state, action: PayloadAction<Agent>) => {
      state.currentAgent = action.payload;
      state.error = null;
    },
    clearCurrentAgent: (state) => {
      state.currentAgent = null;
    },
    setAgentList: (state, action: PayloadAction<Agent[]>) => {
      state.agentList = action.payload;
      state.error = null;
    },
    addAgent: (state, action: PayloadAction<Agent>) => {
      state.agentList.push(action.payload);
    },
    updateAgent: (state, action: PayloadAction<Agent>) => {
      const index = state.agentList.findIndex(
        (agent) => agent.id === action.payload.id
      );
      if (index !== -1) {
        state.agentList[index] = action.payload;
      }
      if (state.currentAgent?.id === action.payload.id) {
        state.currentAgent = action.payload;
      }
    },
    removeAgent: (state, action: PayloadAction<string>) => {
      state.agentList = state.agentList.filter(
        (agent) => agent.id !== action.payload
      );
      if (state.currentAgent?.id === action.payload) {
        state.currentAgent = null;
      }
    },
    updateAgentStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: "active" | "inactive" | "busy";
      }>
    ) => {
      const { id, status } = action.payload;
      const agent = state.agentList.find((agent) => agent.id === id);
      if (agent) {
        agent.status = status;
      }
      if (state.currentAgent?.id === id) {
        state.currentAgent.status = status;
      }
    },
    assignCampaignToAgent: (
      state,
      action: PayloadAction<{ agentId: string; campaignId: string }>
    ) => {
      const { agentId, campaignId } = action.payload;
      const agent = state.agentList.find((agent) => agent.id === agentId);
      if (agent && !agent.assignedCampaigns.includes(campaignId)) {
        agent.assignedCampaigns.push(campaignId);
      }
      if (
        state.currentAgent?.id === agentId &&
        !state.currentAgent.assignedCampaigns.includes(campaignId)
      ) {
        state.currentAgent.assignedCampaigns.push(campaignId);
      }
    },
    unassignCampaignFromAgent: (
      state,
      action: PayloadAction<{ agentId: string; campaignId: string }>
    ) => {
      const { agentId, campaignId } = action.payload;
      const agent = state.agentList.find((agent) => agent.id === agentId);
      if (agent) {
        agent.assignedCampaigns = agent.assignedCampaigns.filter(
          (id) => id !== campaignId
        );
      }
      if (state.currentAgent?.id === agentId) {
        state.currentAgent.assignedCampaigns =
          state.currentAgent.assignedCampaigns.filter(
            (id) => id !== campaignId
          );
      }
    },
    setSelectedAgent: (state, action: PayloadAction<string | null>) => {
      state.selectedAgentId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCurrentAgent,
  clearCurrentAgent,
  setAgentList,
  addAgent,
  updateAgent,
  removeAgent,
  updateAgentStatus,
  assignCampaignToAgent,
  unassignCampaignFromAgent,
  setSelectedAgent,
  setLoading,
  setError,
  clearError,
} = agentSlice.actions;

export default agentSlice.reducer;
