import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:7000/api/auth';

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const signup = async (name: string, email: string, password: string, phone?: string) => {
  const res = await axios.post(`${API_URL}/register`, { name, email, password, phone });
  return res.data;
};
