import { useMemo } from 'react';

/**
 * Hook para verificar permisos del usuario actual
 *
 * Uso:
 * const permissions = usePermissions();
 *
 * if (permissions.can('create_request')) {
 *   // Mostrar botón de crear
 * }
 *
 * if (permissions.canAny(['edit_own_request', 'edit_any_request'])) {
 *   // Mostrar botón de editar
 * }
 *
 * if (permissions.canAll(['create_request', 'delete_request'])) {
 *   // Usuario es admin
 * }
 */
export const usePermissions = () => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const userRole = user?.role; // 'CEO', 'DEV_DIRECTOR', 'BACKEND', etc.

  const rolePermissions = useMemo(() => {
    try {
      // Si no hay usuario autenticado, retornar vacío (sin warnings)
      if (!userRole) {
        return {};
      }

      const allPermissions = JSON.parse(localStorage.getItem('rolePermissions') || '{}');

      // Buscar el role ID correspondiente al nombre del rol
      const rolesData = JSON.parse(localStorage.getItem('systemRoles') || '[]');
      const roleData = rolesData.find(r => r.name === userRole);

      if (!roleData) {
        console.warn(`Role ${userRole} not found in system roles`);
        return {};
      }

      return allPermissions[roleData.id] || {};
    } catch {
      return {};
    }
  }, [userRole]);

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  const can = (permission) => {
    // CEO siempre tiene todos los permisos
    if (userRole === 'CEO') return true;

    return rolePermissions[permission] === true;
  };

  /**
   * Verifica si el usuario tiene AL MENOS UNO de los permisos
   */
  const canAny = (permissions) => {
    if (userRole === 'CEO') return true;
    return permissions.some(permission => rolePermissions[permission] === true);
  };

  /**
   * Verifica si el usuario tiene TODOS los permisos
   */
  const canAll = (permissions) => {
    if (userRole === 'CEO') return true;
    return permissions.every(permission => rolePermissions[permission] === true);
  };

  /**
   * Verifica si el usuario NO tiene un permiso
   */
  const cannot = (permission) => {
    return !can(permission);
  };

  /**
   * Verifica si el usuario es dueño de un recurso
   */
  const isOwner = (resourceOwnerId) => {
    return user?.id === resourceOwnerId;
  };

  /**
   * Verifica si puede editar un recurso (basado en si es dueño)
   */
  const canEdit = (resource, resourceOwnerId) => {
    if (userRole === 'CEO') return true;

    // Puede editar cualquiera
    if (can(`edit_any_${resource}`)) return true;

    // Solo puede editar los suyos
    if (can(`edit_own_${resource}`) && isOwner(resourceOwnerId)) return true;

    return false;
  };

  /**
   * Verifica si puede ver un recurso
   */
  const canView = (resource) => {
    if (userRole === 'CEO') return true;

    // Puede ver todos
    if (can(`view_all_${resource}s`)) return true;
    if (can(`view_${resource}`)) return true;

    return false;
  };

  /**
   * Verifica si el usuario está asignado a un request
   */
  const isAssignedTo = (assignments) => {
    if (!assignments || !Array.isArray(assignments)) return false;
    return assignments.some(assignment => assignment.userId === user?.id);
  };

  /**
   * Verifica si debe filtrar datos por usuario
   * (si NO puede ver todos, solo ve los suyos)
   */
  const shouldFilterByUser = (resource) => {
    if (userRole === 'CEO') return false;
    if (can(`view_all_${resource}s`)) return false;
    if (can(`view_team_${resource}`)) return false;
    return true;
  };

  /**
   * Shortcuts para verificaciones comunes
   */
  const isAdmin = () => {
    return userRole === 'CEO' || userRole === 'DEV_DIRECTOR';
  };

  const isDeveloper = () => {
    return ['BACKEND', 'FRONTEND', 'FULLSTACK'].includes(userRole);
  };

  const isSupport = () => {
    return userRole === 'SOPORTE_VOIP';
  };

  return {
    // Datos del usuario
    user,
    userRole,

    // Verificaciones de permisos
    can,
    cannot,
    canAny,
    canAll,

    // Verificaciones de ownership
    isOwner,
    canEdit,
    canView,
    isAssignedTo,

    // Filtrado
    shouldFilterByUser,

    // Shortcuts de roles
    isAdmin,
    isDeveloper,
    isSupport,

    // Permisos raw (para debugging)
    permissions: rolePermissions
  };
};

export default usePermissions;
