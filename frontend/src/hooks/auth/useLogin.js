import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data) => {
    setError('');
    setLoading(true);
    
    try {
      await login(data);
      navigate('/management');
    } catch (error) {
      console.error('ログインに失敗しました:', error.response || error);
      const errorMessage = 'ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。';
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  return {
    error,
    loading,
    handleLogin,
    clearError
  };
};
