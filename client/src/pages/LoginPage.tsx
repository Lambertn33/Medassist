import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLogin } from '@/hooks/useAuth';
import { LoginForm } from '@/components/login/LoginForm';
import { LoginHeader } from '@/components/login/LoginHeader';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate('/');
        },
      }
    );
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        {/* Header */}
        <div className="text-center">
          <LoginHeader />
        </div>

        {/* Login Form */}
        <LoginForm handleSubmit={handleSubmit} loginMutation={loginMutation} email={email} setEmail={setEmail} password={password} setPassword={setPassword} />

        {/* Additional Info */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Need help? Contact your system administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

