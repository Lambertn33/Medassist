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

export const createEncounter = async (patientId: number) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No token found. Please login to create encounters.');
  }

  try {
    const response = await axios.post(
      `${API_URL}/common/encounters`,
      { patient_id: patientId },
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
      const errorMessage = error.response.data?.message || 'Failed to create encounter';
      const errors = error.response.data?.errors;
      throw new Error(errors ? JSON.stringify(errors) : errorMessage);
    }
    throw error;
  }
};  

export const getEncounter = async (id: number) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No token found. Please login to access encounters.');
  }

  const response = await axios.get(`${API_URL}/common/encounters/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getEncounterObservations = async (id: number) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No token found. Please login to access observations.');
  }

  const response = await axios.get(`${API_URL}/common/encounters/${id}/observations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; 
};

export const getEncounterDiagnoses = async (id: number) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No token found. Please login to access diagnoses.');
  }

  const response = await axios.get(`${API_URL}/common/encounters/${id}/diagnoses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; 
};