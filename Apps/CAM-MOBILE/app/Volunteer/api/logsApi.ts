import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:7000/api/logs';

export const addCollectionLog = async (log: any, token: string) => {
  const res = await axios.post(`${API_URL}/collection`, log, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const addDistributionLog = async (log: any, token: string) => {
  const res = await axios.post(`${API_URL}/distribution`, log, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
