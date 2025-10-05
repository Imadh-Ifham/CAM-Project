// app/volunteer/api/campaignApi.ts
import axios from 'axios';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:7000/api/campaigns';

/**
 * Get all campaigns (admin use)
 */
export const getAllCampaigns = async (token: string) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Get campaigns assigned to the logged-in volunteer
 */
export const getMyCampaigns = async (token: string) => {
  const res = await axios.get(`${API_URL}/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Get detailed campaign info with progress
 */
export const getCampaignById = async (id: string, token: string) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Add a collection log
 */
export const addCollectionLog = async (
  id: string,
  log: any,
  token: string
) => {
  const res = await axios.post(`${API_URL}/${id}/collect`, log, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Add a distribution log
 */
export const addDistributionLog = async (
  id: string,
  log: any,
  token: string
) => {
  const res = await axios.post(`${API_URL}/${id}/distribute`, log, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Get volunteer's history (collection or distribution)
 */
export const getHistory = async (
  id: string,
  type: 'collection' | 'distribution',
  token: string
) => {
  const res = await axios.get(`${API_URL}/${id}/history`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { type },
  });
  return res.data;
};
