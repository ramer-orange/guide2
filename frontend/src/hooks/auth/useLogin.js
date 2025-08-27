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
      return { success: true };
    } catch (error) {
      console.error('ログインに失敗しました:', error.response || error);
      
      let errorMessage = 'ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。';
      
      if (error.response?.status === 422 && error.response?.data?.errors) {
        // バリデーションエラーの処理
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessage = errorMessages.join(' ');
      }
      
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

