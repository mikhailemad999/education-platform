import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { UserRole } from '../../types';
import { AccessDeniedPage } from '../../pages/auth/AccessDeniedPage';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentRole = useAuthStore((state) => state.currentRole);

  if (!isAuthenticated || !currentRole) {
    // If attempting to access staff/management area, redirect to staff portal login
    const isStaffRoute =
      location.pathname.startsWith('/instructor') ||
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/superadmin');

    if (isStaffRoute) {
      return <Navigate to="/portal/login" state={{ from: location }} replace />;
    }

    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if role is allowed
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <AccessDeniedPage requiredRoles={allowedRoles} currentRole={currentRole} />;
  }

  return <>{children}</>;
};
