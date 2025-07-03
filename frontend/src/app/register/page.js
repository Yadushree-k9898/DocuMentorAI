'use client';

import AuthForm from '../../components/AuthForm';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleRegister = async (form) => {
    try {
      await api.post('/auth/register', form);
      router.push('/login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm isLogin={false} onSubmit={handleRegister} />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
