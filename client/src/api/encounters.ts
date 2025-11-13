import axios from 'axios';
import { API_URL } from './constants';
import { getAuthHeaders, handleAxiosError } from './utils';

import type { ICreateObservation } from '@/interfaces/encounters/IObservation';
import type { ICreateDiagnosis } from '@/interfaces/encounters/IDiagnosis';
import type { ICreateTreatment } from '@/interfaces/encounters/ITreatment';

export const getEncounters = async (patientId?: number | null, status?: string | null) => {
  try {
    const params: { patient_id?: number; status?: string } = {};
    if (patientId) {
      params.patient_id = patientId;
    }
    if (status) {
      params.status = status;
    }

    const response = await axios.get(`${API_URL}/common/encounters`, {
      params,
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch encounters');
  }
};

export const createEncounter = async (patientId: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/common/encounters`,
      { patient_id: patientId },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to create encounter');
  }
};  

export const getEncounter = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/common/encounters/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch encounter details');
  }
};

export const getEncounterObservations = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/common/encounters/${id}/observations`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch observations');
  }
};

export const createEncounterObsevation = async (id: number, observation: ICreateObservation) => {
  try {
    const response = await axios.post(
      `${API_URL}/common/encounters/${id}/observations`,
      observation,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to create observation');
  }
};

export const startEncounterConsultation = async (id: number) => {
  try {
    const response = await axios.put(
      `${API_URL}/common/encounters/${id}/start-consultation`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to start consultation');
  }
};


export const cancelEncounterConsultation = async (id: number) => {
  try {
    const response = await axios.put(
      `${API_URL}/common/encounters/${id}/cancel-consultation`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to cancel consultation');
  }
};

export const endEncounterConsultation = async (id: number, summary: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/common/encounters/${id}/end-consultation`,
      { summary },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to end consultation');
  }
};

export const getEncounterDiagnoses = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/common/encounters/${id}/diagnoses`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch diagnoses');
  }
};

export const createEncounterDiagnosis = async (id: number, diagnosis: ICreateDiagnosis) => {
  try {
    const response = await axios.post(
      `${API_URL}/common/encounters/${id}/diagnoses`,
      diagnosis,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to create diagnosis');
  }
};

export const getEncounterTreatments = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/common/encounters/${id}/treatments`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch treatments');
  }
};

export const createEncounterTreatment = async (id: number, treatment: ICreateTreatment) => {
  try {
    const response = await axios.post(
      `${API_URL}/common/encounters/${id}/treatments`,
      treatment,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to create treatment');
  }
};