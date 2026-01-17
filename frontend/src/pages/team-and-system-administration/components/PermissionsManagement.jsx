import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { systemConfigService } from '../../../services/systemConfigService';

/**
 * PermissionsManagement - Gestión granular de permisos por rol
 */
const PermissionsManagement = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Permisos granulares del sistema organizados por módulo
  const availablePermissions = [
    // DASHBOARDS
    {
      id: 'view_executive_dashboard',
      label: 'Ver Panel Ejecutivo',
      category: 'Dashboards',
      description: 'Acceso al dashboard ejecutivo con métricas generales'
    },
    {
      id: 'view_analytics_dashboard',
      label: 'Ver Analytics e Insights',
      category: 'Dashboards',
      description: 'Acceso al dashboard de analíticas avanzadas'
    },
    {
      id: 'view_predictive_dashboard',
      label: 'Ver Dashboard Predictivo',
      category: 'Dashboards',
      description: 'Acceso al dashboard de análisis predictivo de riesgos'
    },

    // GESTIÓN DE SOLICITUDES
    {
      id: 'view_all_requests',
      label: 'Ver Todas las Solicitudes',
      category: 'Gestión de Solicitudes',
      description: 'Ver requests de todos los usuarios (sino, solo las asignadas)'
    },
    {
      id: 'create_request',
      label: 'Crear Solicitudes',
      category: 'Gestión de Solicitudes',
      description: 'Crear nuevas solicitudes en el sistema'
    },
    {
      id: 'edit_own_request',
      label: 'Editar Solicitudes Propias',
      category: 'Gestión de Solicitudes',
      description: 'Editar requests asignados al usuario'
    },
    {
      id: 'edit_any_request',
      label: 'Editar Cualquier Solicitud',
      category: 'Gestión de Solicitudes',
      description: 'Editar requests de cualquier usuario'
    },
    {
      id: 'delete_request',
      label: 'Eliminar Solicitudes',
      category: 'Gestión de Solicitudes',
      description: 'Eliminar requests del sistema'
    },
    {
      id: 'assign_request',
      label: 'Asignar Solicitudes',
      category: 'Gestión de Solicitudes',
      description: 'Asignar requests a otros usuarios'
    },
    {
      id: 'change_request_status',
      label: 'Cambiar Estado de Solicitudes',
      category: 'Gestión de Solicitudes',
      description: 'Modificar el estado de las requests'
    },

    // PLANIFICACIÓN DE CAPACIDAD
    {
      id: 'view_team_capacity',
      label: 'Ver Capacidad de Todo el Equipo',
      category: 'Planificación de Capacidad',
      description: 'Ver calendario de todo el equipo (sino, solo el propio)'
    },
    {
      id: 'assign_capacity',
      label: 'Asignar Tareas en Capacidad',
      category: 'Planificación de Capacidad',
      description: 'Crear asignaciones de tareas a miembros del equipo'
    },
    {
      id: 'edit_team_capacity',
      label: 'Editar Capacidad del Equipo',
      category: 'Planificación de Capacidad',
      description: 'Modificar capacidad semanal de usuarios'
    },
    {
      id: 'export_capacity_planning',
      label: 'Exportar Planning a Excel',
      category: 'Planificación de Capacidad',
      description: 'Exportar planificación semanal a Excel'
    },

    // OKRs Y ROADMAP
    {
      id: 'view_okrs',
      label: 'Ver OKRs',
      category: 'OKRs y Roadmap',
      description: 'Acceso al módulo de OKRs del equipo'
    },
    {
      id: 'create_okr',
      label: 'Crear OKRs',
      category: 'OKRs y Roadmap',
      description: 'Crear nuevos OKRs y objetivos'
    },
    {
      id: 'edit_own_okr',
      label: 'Editar OKRs Propios',
      category: 'OKRs y Roadmap',
      description: 'Editar OKRs donde el usuario es owner'
    },
    {
      id: 'edit_any_okr',
      label: 'Editar Cualquier OKR',
      category: 'OKRs y Roadmap',
      description: 'Editar OKRs de cualquier usuario'
    },
    {
      id: 'delete_okr',
      label: 'Eliminar OKRs',
      category: 'OKRs y Roadmap',
      description: 'Eliminar OKRs del sistema'
    },
    {
      id: 'manage_roadmap',
      label: 'Gestionar Roadmap',
      category: 'OKRs y Roadmap',
      description: 'Crear y editar features del roadmap'
    },

    // PRODUCTOS Y CLIENTES
    {
      id: 'view_products_clients',
      label: 'Ver Productos y Clientes',
      category: 'Productos y Clientes',
      description: 'Acceso al portfolio de productos y clientes'
    },
    {
      id: 'manage_products',
      label: 'Gestionar Productos',
      category: 'Productos y Clientes',
      description: 'Crear, editar y eliminar productos'
    },
    {
      id: 'manage_clients',
      label: 'Gestionar Clientes',
      category: 'Productos y Clientes',
      description: 'Crear, editar y eliminar clientes'
    },
    {
      id: 'view_client_health',
      label: 'Ver Salud de Clientes',
      category: 'Productos y Clientes',
      description: 'Ver métricas de salud y riesgo de clientes'
    },

    // ADMINISTRACIÓN
    {
      id: 'manage_users',
      label: 'Gestionar Usuarios',
      category: 'Administración',
      description: 'Crear, editar y eliminar usuarios del sistema'
    },
    {
      id: 'manage_roles',
      label: 'Gestionar Roles y Permisos',
      category: 'Administración',
      description: 'Configurar permisos por rol'
    },
    {
      id: 'manage_skills',
      label: 'Gestionar Habilidades',
      category: 'Administración',
      description: 'Administrar catálogo de habilidades'
    },
    {
      id: 'manage_system_config',
      label: 'Configuración del Sistema',
      category: 'Administración',
      description: 'Acceso a configuración general del sistema'
    },
    {
      id: 'view_activity_logs',
      label: 'Ver Registro de Actividades',
      category: 'Administración',
      description: 'Acceso al historial completo de actividades'
    },

    // DATOS Y REPORTES
    {
      id: 'export_data',
      label: 'Exportar Datos',
      category: 'Datos y Reportes',
      description: 'Exportar información del sistema a Excel/CSV'
    },
    {
      id: 'import_data',
      label: 'Importar Datos',
      category: 'Datos y Reportes',
      description: 'Importar datos masivos al sistema'
    },
    {
      id: 'manage_backups',
      label: 'Gestionar Respaldos',
      category: 'Datos y Reportes',
      description: 'Crear y restaurar respaldos del sistema'
    },
  ];

  // Permisos predefinidos por rol
  const defaultRolePermissions = {
    'CEO': {
      // CEO tiene TODO
      permissions: availablePermissions.map(p => p.id),
      locked: true
    },
    'DEV_DIRECTOR': {
      // Director tiene casi todo excepto configuración del sistema
      permissions: availablePermissions
        .filter(p => p.id !== 'manage_system_config')
        .map(p => p.id),
      locked: false
    },
    'BACKEND': {
      permissions: [
        // Solo requests asignadas
        'edit_own_request',
        'change_request_status',
        // Solo su calendario
        'export_capacity_planning',
        // Ver OKRs del equipo, editar solo los suyos
        'view_okrs',
        'edit_own_okr',
      ],
      locked: false
    },
    'FRONTEND': {
      permissions: [
        'edit_own_request',
        'change_request_status',
        'export_capacity_planning',
        'view_okrs',
        'edit_own_okr',
      ],
      locked: false
    },
    'FULLSTACK': {
      permissions: [
        'edit_own_request',
        'change_request_status',
        'export_capacity_planning',
        'view_okrs',
        'edit_own_okr',
      ],
      locked: false
    },
    'SOPORTE_VOIP': {
      permissions: [
        // Solo requests de soporte asignadas
        'edit_own_request',
        'change_request_status',
        // Solo su calendario
        'export_capacity_planning',
      ],
      locked: false
    }
  };

  // Agrupar permisos por categoría
  const permissionsByCategory = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) acc[permission.category] = [];
    acc[permission.category].push(permission);
    return acc;
  }, {});

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      // Usar roles hardcodeados para evitar problemas de permisos (403)
      // En el futuro, esto debería venir del backend cuando esté configurado correctamente
      const rolesData = [
        { id: 'role_ceo', name: 'CEO', label: 'CEO' },
        { id: 'role_dev_director', name: 'DEV_DIRECTOR', label: 'Director de Desarrollo' },
        { id: 'role_backend', name: 'BACKEND', label: 'Desarrollador Backend' },
        { id: 'role_frontend', name: 'FRONTEND', label: 'Desarrollador Frontend' },
        { id: 'role_fullstack', name: 'FULLSTACK', label: 'Desarrollador Full Stack' },
        { id: 'role_soporte', name: 'SOPORTE_VOIP', label: 'Soporte VoIP' }
      ];

      setRoles(rolesData);

      // 🔑 GUARDAR ROLES EN LOCALSTORAGE para usePermissions hook
      localStorage.setItem('systemRoles', JSON.stringify(rolesData));

      // Cargar permisos desde localStorage o usar defaults
      const savedPermissions = JSON.parse(localStorage.getItem('rolePermissions') || '{}');

      // Inicializar permisos con defaults si no existen
      const initialPermissions = {};
      rolesData.forEach(role => {
        if (savedPermissions[role.id]) {
          initialPermissions[role.id] = savedPermissions[role.id];
        } else if (defaultRolePermissions[role.name]) {
          // Usar permisos por defecto según el rol
          const defaults = defaultRolePermissions[role.name].permissions;
          initialPermissions[role.id] = defaults.reduce((acc, permId) => {
            acc[permId] = true;
            return acc;
          }, {});
        }
      });

      setPermissions(initialPermissions);

      // Seleccionar el primer rol por defecto
      if (rolesData.length > 0 && !selectedRole) {
        selectRole(rolesData[0]);
      }
    } catch (error) {
      console.error('Error loading roles:', error);
      alert('Error al cargar los roles');
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (role) => {
    setSelectedRole(role);

    // Si el rol no tiene permisos configurados, usar defaults
    if (!permissions[role.id] && defaultRolePermissions[role.name]) {
      const defaults = defaultRolePermissions[role.name].permissions;
      setPermissions(prev => ({
        ...prev,
        [role.id]: defaults.reduce((acc, permId) => {
          acc[permId] = true;
          return acc;
        }, {})
      }));
    }
  };

  const togglePermission = (permissionId) => {
    if (!selectedRole) return;

    // Solo el CEO está bloqueado
    if (selectedRole.name === 'CEO') {
      alert('El rol CEO tiene acceso completo al sistema y no se puede modificar');
      return;
    }

    setPermissions(prev => ({
      ...prev,
      [selectedRole.id]: {
        ...prev[selectedRole.id],
        [permissionId]: !prev[selectedRole.id]?.[permissionId]
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Guardar en localStorage
      localStorage.setItem('rolePermissions', JSON.stringify(permissions));

      // TODO: En producción, enviar al backend
      // await systemConfigService.updateRolePermissions(permissions);

      alert('Permisos guardados exitosamente');
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Error al guardar los permisos');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAllCategory = (category) => {
    if (!selectedRole || selectedRole.name === 'CEO') return;

    const categoryPermissions = permissionsByCategory[category];
    const allChecked = categoryPermissions.every(p => isPermissionChecked(p.id));

    setPermissions(prev => {
      const newPerms = { ...prev[selectedRole.id] };
      categoryPermissions.forEach(p => {
        newPerms[p.id] = !allChecked;
      });
      return {
        ...prev,
        [selectedRole.id]: newPerms
      };
    });
  };

  const handleApplyTemplate = (templateName) => {
    if (!selectedRole || selectedRole.name === 'CEO') return;

    if (!window.confirm(`¿Aplicar plantilla "${templateName}" al rol ${selectedRole.label}?`)) {
      return;
    }

    const template = defaultRolePermissions[templateName];
    if (template) {
      setPermissions(prev => ({
        ...prev,
        [selectedRole.id]: template.permissions.reduce((acc, permId) => {
          acc[permId] = true;
          return acc;
        }, {})
      }));
    }
  };

  const isPermissionChecked = (permissionId) => {
    if (!selectedRole) return false;
    return permissions[selectedRole.id]?.[permissionId] || false;
  };

  const getCategoryCheckStatus = (category) => {
    if (!selectedRole) return 'none';
    const categoryPerms = permissionsByCategory[category];
    const checkedCount = categoryPerms.filter(p => isPermissionChecked(p.id)).length;
    if (checkedCount === 0) return 'none';
    if (checkedCount === categoryPerms.length) return 'all';
    return 'some';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Lista de Roles */}
      <div className="lg:col-span-1">
        <div className="bg-card rounded-lg border border-border p-4 sticky top-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Shield" size={16} />
            Roles del Sistema
          </h3>
          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => selectRole(role)}
                className={`
                  w-full text-left px-3 py-2.5 rounded-lg transition-smooth text-sm
                  ${selectedRole?.id === role.id
                    ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                    : 'bg-muted hover:bg-accent text-foreground'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Icon name="Shield" size={16} />
                  <span>{role.label}</span>
                </div>
                {role.name === 'CEO' && (
                  <div className="text-xs mt-1 opacity-75">
                    <Icon name="Lock" size={10} className="inline mr-1" />
                    Acceso completo
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Plantillas rápidas */}
          {selectedRole && selectedRole.name !== 'CEO' && (
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Plantillas
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => handleApplyTemplate('DEV_DIRECTOR')}
                  className="w-full text-xs text-left px-2 py-1.5 rounded hover:bg-accent transition-smooth"
                >
                  Director (Todo excepto config)
                </button>
                <button
                  onClick={() => handleApplyTemplate('BACKEND')}
                  className="w-full text-xs text-left px-2 py-1.5 rounded hover:bg-accent transition-smooth"
                >
                  Desarrollador (Solo operaciones)
                </button>
                <button
                  onClick={() => handleApplyTemplate('SOPORTE_VOIP')}
                  className="w-full text-xs text-left px-2 py-1.5 rounded hover:bg-accent transition-smooth"
                >
                  Soporte (Mínimo)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Panel de Permisos */}
      <div className="lg:col-span-3">
        {selectedRole ? (
          <div className="bg-card rounded-lg border border-border p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Icon name="Shield" size={20} />
                  Permisos para {selectedRole.label}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedRole.name === 'CEO'
                    ? 'Este rol tiene acceso completo y no puede ser modificado'
                    : 'Selecciona los permisos específicos para este rol'
                  }
                </p>
              </div>
              {selectedRole.name !== 'CEO' && (
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  iconName="Save"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              )}
            </div>

            {/* Permisos agrupados por categoría */}
            <div className="space-y-6">
              {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => {
                const checkStatus = getCategoryCheckStatus(category);
                return (
                  <div key={category} className="bg-muted/30 rounded-lg p-4">
                    {/* Header de categoría con checkbox "Seleccionar todos" */}
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Icon
                          name={
                            category === 'Dashboards' ? 'LayoutDashboard' :
                            category === 'Gestión de Solicitudes' ? 'Inbox' :
                            category === 'Planificación de Capacidad' ? 'Calendar' :
                            category === 'OKRs y Roadmap' ? 'Target' :
                            category === 'Productos y Clientes' ? 'Briefcase' :
                            category === 'Administración' ? 'Settings' :
                            'Database'
                          }
                          size={16}
                        />
                        {category}
                      </h4>
                      {selectedRole.name !== 'CEO' && (
                        <button
                          onClick={() => handleSelectAllCategory(category)}
                          className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                        >
                          <Icon
                            name={checkStatus === 'all' ? 'CheckSquare' : 'Square'}
                            size={14}
                          />
                          {checkStatus === 'all' ? 'Desmarcar todos' : 'Seleccionar todos'}
                        </button>
                      )}
                    </div>

                    {/* Grid de permisos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoryPermissions.map((permission) => (
                        <label
                          key={permission.id}
                          className={`
                            flex items-start gap-3 p-3 rounded-lg border transition-smooth cursor-pointer
                            ${isPermissionChecked(permission.id)
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-border hover:border-accent hover:bg-accent/5'
                            }
                            ${selectedRole.name === 'CEO' ? 'cursor-not-allowed opacity-75' : ''}
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={isPermissionChecked(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            disabled={selectedRole.name === 'CEO'}
                            className="mt-0.5 w-4 h-4 text-primary border-border rounded focus:ring-primary"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground">
                              {permission.label}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {permission.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info footer */}
            {selectedRole.name !== 'CEO' && (
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <Icon name="Info" size={16} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-xs text-blue-800 dark:text-blue-300">
                    <strong>Nota:</strong> Los permisos se aplican inmediatamente después de guardar.
                    Los usuarios con este rol necesitarán cerrar sesión y volver a ingresar para ver los cambios reflejados.
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <Icon name="Shield" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Selecciona un rol para gestionar sus permisos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionsManagement;
