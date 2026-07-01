import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isSuperAdmin } = useAuth();

  if (!user) {
    return <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">Loading...</div>;
  }

  if (!isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
