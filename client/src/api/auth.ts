import axios from 'axios';
import { API_URL } from './constants';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Extract error message from API response
      const message = error.response.data?.message || 'Login failed';
      throw new Error(message);
    }
    throw new Error('An unexpected error occurred');
  }
};

export const logout = async () => {
  const response = await axios.post(`${API_URL}/auth/logout`);
  return response.data;
};