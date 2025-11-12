import axios from 'axios';
import { API_URL } from './constants';

export const getDashboardData = async () => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('No token found. Please login to access dashboard data.');
  }

  try {
    const response = await axios.get(`${API_URL}/common/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response.data?.message || 'Failed to fetch dashboard data';
      throw new Error(message);
    }
    throw new Error('An unexpected error occurred');
  }
};