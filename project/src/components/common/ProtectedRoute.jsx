import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== allowedRole) {
    if (user?.role === 'student') {
      return <Navigate to="/student/dashboard" />;
    } else if (user?.role === 'lecturer') {
      return <Navigate to="/lecturer/dashboard" />;
    } else if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
