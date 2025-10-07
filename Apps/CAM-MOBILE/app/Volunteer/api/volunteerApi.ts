// app/volunteer/api/volunteerApi.ts
import axios from 'axios';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:7000/api/auth';

/**
 * Get volunteer profile (authenticated)
 */
export const getVolunteerProfile = async (token: string) => {
  const res = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Update volunteer profile details
 */
export const updateVolunteerProfile = async (data: any, token: string) => {
  const res = await axios.put(`${API_URL}/me`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
