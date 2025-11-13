import axios from 'axios';
import { API_URL } from './constants';

export const getEncounters = async (patientId?: number | null, status?: string | null) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No token found. Please login to access encounters.');
  }

  const params: { patient_id?: number; status?: string } = {};
  if (patientId) {
    params.patient_id = patientId;
  }
  if (status) {
    params.status = status;
  }

  const response = await axios.get(`${API_URL}/common/encounters`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};  