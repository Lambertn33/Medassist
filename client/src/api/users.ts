import axios from 'axios';
import { API_URL } from './constants';
import { getAuthHeaders, handleAxiosError } from './utils';

export const getUsers = async (search: string | null = null) => {
  try {
    const params = search ? { search } : {};
    
    const response = await axios.get(`${API_URL}/admin/users`, {
      params,
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch users');
  }
};