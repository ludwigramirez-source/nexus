import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const RolePermissionModal = ({ isOpen, onClose, onSave, role, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const [errors, setErrors] = useState({});

  const availablePermissions = [
    { id: 'view_dashboard', label: 'Ver Panel de Control', category: 'dashboard' },
    { id: 'view_requests', label: 'Ver Solicitudes', category: 'requests' },
    { id: 'create_requests', label: 'Crear Solicitudes', category: 'requests' },
    { id: 'edit_requests', label: 'Editar Solicitudes', category: 'requests' },
    { id: 'delete_requests', label: 'Eliminar Solicitudes', category: 'requests' },
    { id: 'assign_requests', label: 'Asignar Solicitudes', category: 'requests' },
    { id: 'view_capacity', label: 'Ver Capacidad', category: 'capacity' },
    { id: 'edit_capacity', label: 'Editar Capacidad', category: 'capacity' },
    { id: 'view_okrs', label: 'Ver OKRs', category: 'okrs' },
    { id: 'edit_okrs', label: 'Editar OKRs', category: 'okrs' },
    { id: 'view_products', label: 'Ver Productos', category: 'products' },
    { id: 'create_products', label: 'Crear Productos', category: 'products' },
    { id: 'edit_products', label: 'Editar Productos', category: 'products' },
    { id: 'delete_products', label: 'Eliminar Productos', category: 'products' },
    { id: 'view_clients', label: 'Ver Clientes', category: 'clients' },
    { id: 'create_clients', label: 'Crear Clientes', category: 'clients' },
    { id: 'edit_clients', label: 'Editar Clientes', category: 'clients' },
    { id: 'delete_clients', label: 'Eliminar Clientes', category: 'clients' },
    { id: 'view_analytics', label: 'Ver Analíticas', category: 'analytics' },
    { id: 'export_data', label: 'Exportar Datos', category: 'analytics' },
    { id: 'view_users', label: 'Ver Usuarios', category: 'admin' },
    { id: 'create_users', label: 'Crear Usuarios', category: 'admin' },
    { id: 'edit_users', label: 'Editar Usuarios', category: 'admin' },
    { id: 'delete_users', label: 'Eliminar Usuarios', category: 'admin' },
    { id: 'manage_roles', label: 'Gestionar Roles', category: 'admin' },
    { id: 'system_config', label: 'Configuración del Sistema', category: 'admin' }
  ];

  useEffect(() => {
    if (role && mode === 'edit') {
      setFormData({
        name: role?.name,
        description: role?.description,
        permissions: role?.permissions
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: []
      });
    }
    setErrors({});
  }, [role, mode, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'El nombre del rol es requerido';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (formData?.permissions?.length === 0) {
      newErrors.permissions = 'Debe seleccionar al menos un permiso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev?.permissions?.includes(permissionId)
        ? prev?.permissions?.filter(p => p !== permissionId)
        : [...prev?.permissions, permissionId]
    }));
  };

  const groupedPermissions = availablePermissions?.reduce((acc, perm) => {
    if (!acc?.[perm?.category]) {
      acc[perm?.category] = [];
    }
    acc?.[perm?.category]?.push(perm);
    return acc;
  }, {});

  const categoryLabels = {
    dashboard: 'Panel de Control',
    requests: 'Solicitudes',
    capacity: 'Capacidad',
    okrs: 'OKRs',
    products: 'Productos',
    clients: 'Clientes',
    analytics: 'Analíticas',
    admin: 'Administración'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg border border-border shadow-elevation-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
            {mode === 'create' ? 'Crear Rol' : 'Editar Rol'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
            className="h-8 w-8"
          />
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
          <Input
            label="Nombre del Rol"
            type="text"
            placeholder="Ej: Desarrollador Senior"
            value={formData?.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
            error={errors?.name}
            required
          />

          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Descripción
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              rows="3"
              placeholder="Describe el rol y sus responsabilidades..."
              value={formData?.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
            />
            {errors?.description && (
              <p className="text-xs text-error mt-1">{errors?.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-3">
              Permisos
            </label>
            {errors?.permissions && (
              <p className="text-xs text-error mb-2">{errors?.permissions}</p>
            )}
            <div className="space-y-4 max-h-96 overflow-y-auto border border-border rounded-lg p-4">
              {Object.entries(groupedPermissions)?.map(([category, permissions]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-caption font-semibold text-foreground">
                    {categoryLabels?.[category]}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {permissions?.map((perm) => (
                      <Checkbox
                        key={perm?.id}
                        label={perm?.label}
                        checked={formData?.permissions?.includes(perm?.id)}
                        onChange={() => handlePermissionToggle(perm?.id)}
                        size="sm"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
              className="sm:flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Save"
              iconPosition="left"
              fullWidth
              className="sm:flex-1"
            >
              {mode === 'create' ? 'Crear Rol' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolePermissionModal;