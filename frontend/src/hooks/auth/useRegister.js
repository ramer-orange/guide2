import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';

export const useRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data) => {
    setError('');
    setLoading(true);
    
    try {
      await register(data);
      navigate('/management');
    } catch (error) {
      console.error('登録に失敗しました:', error);
      
      let errorMessage = '登録に失敗しました。もう一度お試しください。';
      
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
    handleRegister,
    clearError
  };
};
