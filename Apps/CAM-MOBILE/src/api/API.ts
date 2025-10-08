const EXPO_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7000";
const API_URL = `${EXPO_URL}/api`;

const API = {
  CAMPAIGN: {
    CREATE_CAMPAIGN: `${API_URL}/campaigns/`,
    LIST_CAMPAIGNS: `${API_URL}/campaigns/`,
    GET_CAMPAIGN: (id: string) => `${API_URL}/campaigns/${id}`,
  },
  VOLUNTEER: {
    PROFILE: `${API_URL}/auth/me`,
    REGISTER: `${API_URL}/volunteer/register`,
    LIST: `${API_URL}/volunteers/`,
    ASSIGN_TO_CAMPAIGN: `${API_URL}/volunteers/assign`,
  },
  AGENT: {
    REGISTER: `${API_URL}/agent/register`,
  },
  AUTH: {
    ME: `${API_URL}/auth/me`,
  },
};

export default API;
