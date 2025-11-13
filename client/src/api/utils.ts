import axios from 'axios';

export const getAuthToken = (): string => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No token found. Please login to access this resource.');
  }
  return token;
};

export const getAuthHeaders = () => {
  return {
    Authorization: `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json',
  };
};

export const handleAxiosError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error) && error.response) {
    const errorMessage = error.response.data?.message || defaultMessage;
    const errors = error.response.data?.errors;
    throw new Error(errors ? JSON.stringify(errors) : errorMessage);
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error(defaultMessage);
};

