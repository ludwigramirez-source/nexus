import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { systemConfigService } from '../../../services/systemConfigService';

/**
 * PermissionsManagement - Gestión de permisos por rol
 *
 * IMPORTANTE:
 * - Solo el rol "CEO" tiene acceso completo bloqueado (no modificable)
 * - Todos los demás roles (incluido DEV_DIRECTOR) pueden configurarse
 * - Si agregas nuevos roles administrativos, solo CEO debe estar bloqueado
 */
const PermissionsManagement = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Permisos disponibles en el sistema
  const availablePermissions = [
    { id: 'users', label: 'Gestión de Usuarios', category: 'Equipo' },
    { id: 'roles', label: 'Gestión de Permisos', category: 'Equipo' },
    { id: 'skills', label: 'Gestión de Habilidades', category: 'Equipo' },
    { id: 'system_config', label: 'Configuración del Sistema', category: 'Sistema' },
    { id: 'products', label: 'Productos', category: 'Sistema' },
    { id: 'clients', label: 'Clientes', category: 'Sistema' },
    { id: 'okrs', label: 'OKRs', category: 'Sistema' },
    { id: 'integrations', label: 'Integraciones', category: 'Sistema' },
    { id: 'export', label: 'Exportar Datos', category: 'Datos' },
    { id: 'import', label: 'Importar Datos', category: 'Datos' },
    { id: 'backup', label: 'Respaldos', category: 'Datos' },
  ];

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
      const response = await systemConfigService.getAllRoles();
      const rolesData = response?.data?.roles || [];
      setRoles(rolesData);

      // Seleccionar el primer rol por defecto
      if (rolesData.length > 0 && !selectedRole) {
        selectRole(rolesData[0]);
      }

      // Cargar permisos guardados desde localStorage
      const savedPermissions = JSON.parse(localStorage.getItem('rolePermissions') || '{}');
      setPermissions(savedPermissions);
    } catch (error) {
      console.error('Error loading roles:', error);
      alert('Error al cargar los roles');
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (role) => {
    setSelectedRole(role);

    // SOLO CEO tiene acceso a todo por defecto y bloqueado
    // DEV_DIRECTOR y otros roles nuevos pueden configurarse
    if (role.name === 'CEO') {
      const allPermissions = availablePermissions.reduce((acc, perm) => {
        acc[perm.id] = true;
        return acc;
      }, {});
      setPermissions(prev => ({
        ...prev,
        [role.id]: allPermissions
      }));
    }
  };

  const togglePermission = (permissionId) => {
    if (!selectedRole) return;

    // SOLO el CEO no se puede modificar (tiene acceso completo siempre)
    // NOTA: Si agregas nuevos roles administrativos, el CEO es el único bloqueado
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

  const handleSave = () => {
    setSaving(true);
    try {
      // Guardar en localStorage (en producción, esto debería ir al backend)
      localStorage.setItem('rolePermissions', JSON.stringify(permissions));
      alert('Permisos guardados exitosamente');
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Error al guardar los permisos');
    } finally {
      setSaving(false);
    }
  };

  const isPermissionChecked = (permissionId) => {
    if (!selectedRole) return false;
    return permissions[selectedRole.id]?.[permissionId] || false;
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
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Roles del Sistema</h3>
          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => selectRole(role)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg transition-smooth text-sm
                  ${selectedRole?.id === role.id
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'bg-muted hover:bg-accent text-foreground'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Icon name="Shield" size={16} />
                  <span>{role.label}</span>
                </div>
                {role.name === 'CEO' && (
                  <div className="text-xs mt-1 opacity-75">Acceso completo (bloqueado)</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panel de Permisos */}
      <div className="lg:col-span-3">
        {selectedRole ? (
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Icon name="Shield" size={20} />
                  Permisos para {selectedRole.label}
                </h3>
                {selectedRole.name === 'CEO' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Este rol tiene acceso completo al sistema y no puede ser modificado
                  </p>
                )}
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
              {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryPermissions.map((permission) => (
                      <label
                        key={permission.id}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg border transition-smooth cursor-pointer
                          ${isPermissionChecked(permission.id)
                            ? 'border-primary bg-primary/5'
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
                          className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
