import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <Loading message="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirecting according to dashboard based on role
    const redirectPath =
      user?.role === 'admin'
        ? '/admin/dashboard'
        : user?.role === 'user'
        ? '/user/dashboard'
        : '/store-owner/dashboard';

    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};

export default ProtectedRoute;
