// Get your computer's IP address and update this default
const EXPO_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.2:5000/api";

const API = {
  CAMPAIGN: {
    CREATE_CAMPAIGN: `${EXPO_URL}/campaigns`,
    LIST_CAMPAIGNS: `${EXPO_URL}/campaigns`,
    GET_CAMPAIGN: (id: string) => `${EXPO_URL}/campaigns/${id}`,
    JOIN_CAMPAIGN: (id: string) => `${EXPO_URL}/campaigns/${id}/join`,
  },
  VOLUNTEER: {
    PROFILE: `${EXPO_URL}/volunteer/me`,
    UPDATE_PROFILE: `${EXPO_URL}/volunteer/me`,
    REGISTER: `${EXPO_URL}/volunteer/register`,
    LOGIN: `${EXPO_URL}/volunteer/login`,
    ASSIGN_TO_CAMPAIGN: `${EXPO_URL}/volunteer/assign`,
    CAMPAIGNS: `${EXPO_URL}/volunteer/campaigns`,
  },
  AGENT: {
    REGISTER: `${EXPO_URL}/agent/register`,
    LOGIN: `${EXPO_URL}/agent/login`,
    PROFILE: `${EXPO_URL}/agent/me`,
  },
  AUTH: {
    ME: `${EXPO_URL}/auth/me`,
  },
};

export default API;
