import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { Role } from '../types';

interface ProtectedRouteProps {
  allowedRole: Role;
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Checking session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    const home = user.role === 'ADMIN' ? '/admin/dashboard' : '/reception/dashboard';
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}