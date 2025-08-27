import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api/api';

export const useRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data) => {
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/register', data);
      
      // ログイン画面に遷移する前にトークンを保存
      if (response.data.token) {
        // トークンが返されている場合はログイン処理も一緒に行う
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/management'); // トークンがあれば直接管理画面へ
      } else {
        // トークンがなければログイン画面へ
        navigate('/login');
      }
      
      return { success: true };
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
