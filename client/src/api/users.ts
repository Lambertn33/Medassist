import axios from 'axios';
import { API_URL } from './constants';
import { getAuthHeaders, handleAxiosError } from './utils';
import type { ICreateUser } from '@/interfaces/users/IUser';

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

export const createUser = async (user: ICreateUser) => {
  try {
    const response = await axios.post(`${API_URL}/admin/users`, user, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    // For axios errors, preserve the error with status code for status checking
    // but format validation errors for the form to parse
    if (axios.isAxiosError(error) && error.response) {
      // Create an error that preserves both status and formatted message
      const formattedError = new Error() as Error & { response?: { status: number } };
      formattedError.response = { status: error.response.status };
      
      if (error.response.status === 422) {
        // Format validation errors as JSON string for form parsing
        const errors = error.response.data?.errors;
        formattedError.message = errors ? JSON.stringify(errors) : (error.response.data?.message || 'Validation failed');
      } else {
        formattedError.message = error.response.data?.message || 'Failed to create user';
      }
      
      throw formattedError;
    }
    handleAxiosError(error, 'Failed to create user');
  }
};