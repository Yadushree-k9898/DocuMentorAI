'use client';

import AuthForm from '../../components/AuthForm';
import useAuth from '../../hooks/useAuth';
import api from '../../lib/api';
import { useState } from 'react';

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (form) => {
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.access_token);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm isLogin onSubmit={handleLogin} />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
