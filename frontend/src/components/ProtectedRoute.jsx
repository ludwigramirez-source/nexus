import React from 'react';
import { Navigate } from 'react-router-dom';
import usePermissions from '../hooks/usePermissions';

/**
 * ProtectedRoute - Component to protect routes based on authentication and permissions
 *
 * Usage:
 * <Route path="/..." element={
 *   <ProtectedRoute permission="view_executive_dashboard">
 *     <ExecutiveDashboard />
 *   </ProtectedRoute>
 * } />
 *
 * Or with anyPermissions for multiple options:
 * <Route path="/..." element={
 *   <ProtectedRoute anyPermissions={['manage_users', 'manage_roles']}>
 *     <TeamAndSystemAdministration />
 *   </ProtectedRoute>
 * } />
 */
const ProtectedRoute = ({
  children,
  permission,
  anyPermissions,
  redirectTo = '/executive-dashboard',
  fallback = null
}) => {
  const permissions = usePermissions();

  // 1. Verificar si el usuario está autenticado
  const isAuthenticated = !!localStorage.getItem('access_token');
  const hasUser = !!permissions.user?.id;

  if (!isAuthenticated || !hasUser) {
    // Si no está autenticado, redirigir al login
    console.warn('🚫 User not authenticated, redirecting to login');
    return <Navigate to="/authentication-and-access-control" replace />;
  }

  // 2. Si no hay permisos cargados aún, mostrar fallback o null (loading)
  if (!permissions.userRole) {
    return fallback;
  }

  // Verificar permisos
  let hasAccess = false;

  if (anyPermissions && Array.isArray(anyPermissions)) {
    // Requiere al menos uno de los permisos
    hasAccess = permissions.canAny(anyPermissions);
  } else if (permission) {
    // Requiere un permiso específico
    hasAccess = permissions.can(permission);
  } else {
    // Si no se especifica permiso, permitir acceso (ruta pública)
    hasAccess = true;
  }

  // Si no tiene acceso, redirigir
  if (!hasAccess) {
    console.warn(`🚫 Access denied to route. Required: ${permission || anyPermissions?.join(', ')}`);
    return <Navigate to={redirectTo} replace />;
  }

  // Si tiene acceso, renderizar children
  return children;
};

export default ProtectedRoute;
