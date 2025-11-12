import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

