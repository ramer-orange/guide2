import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { web, api } from '@/services/api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 認証状態の確認（初期マウント時）
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data } = await api.get('/user');
        setUser(data);
      } catch (error) {
        setUser(null);
        console.error('認証状態の確認エラー:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // ログイン
  const login = async (credentials) => {
    try {
      // CSRFクッキーを取得
      await web.get('/sanctum/csrf-cookie');
      // ログインリクエスト
      const response = await api.post('/login', credentials);
      setUser(response.data);
    } catch (error) {
      console.error('ログイン失敗:', error);
      throw error;
    }
  };

  // ログアウト
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);