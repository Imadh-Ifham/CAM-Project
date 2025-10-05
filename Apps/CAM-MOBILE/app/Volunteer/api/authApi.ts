// app/volunteer/api/authApi.ts
import axios from 'axios';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:7000/api/auth';

/**
 * Register a new volunteer
 */
export const signup = async (
  name: string,
  email: string,
  password: string,
  phone?: string,
  preferredType?: 'collecting' | 'distributing'
) => {
  const res = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
    phone,
    preferredType,
  });
  return res.data;
};

/**
 * Login an existing volunteer
 */
export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

/**
 * Get the currently authenticated volunteer profile
 */
export const getProfile = async (token: string) => {
  const res = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Update volunteer profile (name, phone, preferredType)
 */
export const updateProfile = async (data: any, token: string) => {
  const res = await axios.put(`${API_URL}/me`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
