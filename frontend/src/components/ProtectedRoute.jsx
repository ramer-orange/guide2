// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // ローディング中は何も表示しない
    return null;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};