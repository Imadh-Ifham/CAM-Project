import { RootState } from "../store";

// Agent Selectors
export const selectCurrentAgent = (state: RootState) =>
  state.agent.currentAgent;

export const selectAgentList = (state: RootState) => state.agent.agentList;

export const selectIsLoading = (state: RootState) => state.agent.isLoading;

export const selectError = (state: RootState) => state.agent.error;

export const selectSelectedAgentId = (state: RootState) =>
  state.agent.selectedAgentId;

export const selectSelectedAgent = (state: RootState) => {
  const selectedId = state.agent.selectedAgentId;
  return selectedId
    ? state.agent.agentList.find((agent) => agent.id === selectedId) || null
    : null;
};

export const selectActiveAgents = (state: RootState) =>
  state.agent.agentList.filter((agent) => agent.status === "active");

export const selectAgentsByCampaign =
  (campaignId: string) => (state: RootState) =>
    state.agent.agentList.filter((agent) =>
      agent.assignedCampaigns.includes(campaignId)
    );
