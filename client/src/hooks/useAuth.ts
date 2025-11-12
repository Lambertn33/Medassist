import { useMutation } from '@tanstack/react-query';
import { useAuthContext, type User } from '@/contexts/AuthContext';
import { login } from '@/api/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const useAuth = () => {
  return useAuthContext();
};

export const useLogin = () => {
  const { setUser } = useAuthContext();

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

