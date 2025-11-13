import axios from 'axios';
import { API_URL } from './constants';
import { getAuthHeaders, handleAxiosError } from './utils';

export const getDashboardData = async () => {
  try {
    const response = await axios.get(`${API_URL}/common/dashboard`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch dashboard data');
  }
};