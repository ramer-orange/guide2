// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, loggedOut } = useAuth();

  if (loading) {
    // ローディング中は何も表示しない
    return null;
  }

  // ログアウト時はトップページへリダイレクト
  if (loggedOut) {
    return <Navigate to="/" />;
  }
  else if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};