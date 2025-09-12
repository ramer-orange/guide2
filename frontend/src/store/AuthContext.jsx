import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { web, api } from '@/services/api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);

  // 認証状態の確認（初期マウント時）
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // CSRFクッキーを取得
        await web.get('/sanctum/csrf-cookie');
        const response = await api.get('/user');
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
        console.error('認証状態の確認エラー:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // 新規登録
  const register = async (userData) => {
    try {
      // CSRFクッキーを取得
      await web.get('/sanctum/csrf-cookie');
      // 新規登録リクエスト
      const response = await api.post('/register', userData);
      setUser(response.data.user);
    } catch (error) {
      console.error('登録失敗:', error);
      throw error;
    }
  };

  // ログイン
  const login = async (credentials) => {
    try {
      // CSRFクッキーを取得
      await web.get('/sanctum/csrf-cookie');
      // ログインリクエスト
      const response = await api.post('/login', credentials);
      setUser(response.data.user);
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
      setLoggedOut(true);
      setUser(null);
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    loggedOut,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }), [user, loading, loggedOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);