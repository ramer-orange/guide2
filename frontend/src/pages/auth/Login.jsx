import React from 'react';
import { useLogin } from '@/hooks/auth/useLogin';
import { LoginForm } from '@/components/auth/LoginForm';

export function Login() {
  const { error, loading, handleLogin } = useLogin();

  return (
    <LoginForm 
      onSubmit={handleLogin}
      error={error}
      loading={loading}
    />
  );
}