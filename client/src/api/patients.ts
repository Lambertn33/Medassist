import axios from 'axios';
import { API_URL } from './constants';
import type { PatientFormData } from '@/components/patients/PatientForm';

export const getPatients = async (search: string | null = null) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No token found. Please login to access patients.');
  }
  
  const params = search ? { search } : {};
  
  const response = await axios.get(`${API_URL}/common/patients`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createPatient = async (patientData: PatientFormData) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No token found. Please login to create patients.');
  }

  try {
    const response = await axios.post(
      `${API_URL}/common/patients`,
      patientData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Extract error message from backend response
      const errorMessage = error.response.data?.message || 'Failed to create patient';
      const errors = error.response.data?.errors;
      throw new Error(errors ? JSON.stringify(errors) : errorMessage);
    }
    throw error;
  }
};