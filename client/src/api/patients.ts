import axios from 'axios';
import { API_URL } from './constants';
import { getAuthHeaders, handleAxiosError } from './utils';
import type { IPatientFormData } from '@/interfaces/patients/IPatient';

export const getPatients = async (search: string | null = null) => {
  try {
    const params = search ? { search } : {};
    
    const response = await axios.get(`${API_URL}/common/patients`, {
      params,
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch patients');
  }
};

export const getPatient = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/common/patients/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch patient details');
  }
};

export const createPatient = async (patientData: IPatientFormData) => {
  try {
    const response = await axios.post(
      `${API_URL}/common/patients`,
      patientData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to create patient');
  }
};

export const updatePatient = async (id: number, patientData: IPatientFormData) => {
  try {
    const response = await axios.put(
      `${API_URL}/common/patients/${id}`,
      patientData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to update patient');
  }
};

export const deletePatient = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/common/patients/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to delete patient');
  }
};