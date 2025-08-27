import React from 'react';
import { useRegister } from '@/hooks/auth/useRegister';
import { RegisterForm } from '@/components/auth/RegisterForm';

export function Register() {
  const { error, loading, handleRegister } = useRegister();

  return (
    <RegisterForm 
      onSubmit={handleRegister}
      error={error}
      loading={loading}
    />
  );
}