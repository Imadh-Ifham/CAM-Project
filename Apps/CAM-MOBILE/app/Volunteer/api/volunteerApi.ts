import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:7000/api/volunteers';

export const getVolunteers = async (token: string) => {
  const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const getVolunteerProfile = async (id: string, token: string) => {
  const res = await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};
