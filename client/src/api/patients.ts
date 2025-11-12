import axios from 'axios';
import { API_URL } from './constants';

export const getPatients = async (search: string | null = null) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No token found. Please login to access patients.');
  }
  const response = await axios.get(`${API_URL}/common/patients${search ? `?search=${search}` : ''}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};