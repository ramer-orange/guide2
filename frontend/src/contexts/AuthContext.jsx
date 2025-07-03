// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 認証状態の確認
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          const response = await api.get('/user');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('認証確認エラー:', error);
          localStorage.removeItem('auth_token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  // ログイン関数
  const login = async (credentials) => {
    const response = await api.post('/login', credentials);
    const { user, token } = response.data;
    
    localStorage.setItem('auth_token', token);
    setUser(user);
    setIsAuthenticated(true);
    
    return response;
  };

  // ログアウト関数
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);