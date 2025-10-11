const EXPO_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7000";
const API_URL = `${EXPO_URL}/api`;

const API = {
  CAMPAIGN: `${API_URL}/campaigns/`,
};

export default API;
