import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { systemConfigService } from '../../../services/systemConfigService';

const SystemRolesModal = ({ isOpen, onClose }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      console.log('SystemRolesModal opened, loading roles...');
      loadRoles();
    }
  }, [isOpen]);

  const loadRoles = async () => {
    console.log('loadRoles called');
    setLoading(true);
    try {
      console.log('Fetching roles from API...');
      const response = await systemConfigService.getAllRoles();
      console.log('Roles response:', response);
      setRoles(response?.data?.roles || []);
      console.log('Roles set:', response?.data?.roles);
    } catch (error) {
      console.error('Error loading roles:', error);
      console.error('Error details:', error.response);
      alert('Error al cargar los roles: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.label) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    try {
      await systemConfigService.createRole(formData);
      alert('Rol creado exitosamente');
      setFormData({ name: '', label: '', description: '' });
      loadRoles();
    } catch (error) {
      console.error('Error creating role:', error);
      alert(error.response?.data?.message || 'Error al crear el rol');
    }
  };

  const handleUpdate = async () => {
    if (!formData.label) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    try {
      await systemConfigService.updateRole(editingRole.id, {
        label: formData.label,
        description: formData.description
      });
      alert('Rol actualizado exitosamente');
      setEditingRole(null);
      setFormData({ name: '', label: '', description: '' });
      loadRoles();
    } catch (error) {
      console.error('Error updating role:', error);
      alert(error.response?.data?.message || 'Error al actualizar el rol');
    }
  };

  const handleDelete = async (role) => {
    if (role.isSystem) {
      alert('No se pueden eliminar roles del sistema');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el rol "${role.label}"?`)) {
      return;
    }

    try {
      await systemConfigService.deleteRole(role.id);
      alert('Rol eliminado exitosamente');
      loadRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      alert(error.response?.data?.message || 'Error al eliminar el rol');
    }
  };

  const startEdit = (role) => {
    if (role.isSystem) {
      alert('No se pueden editar roles del sistema');
      return;
    }
    setEditingRole(role);
    setFormData({
      name: role.name,
      label: role.label,
      description: role.description || ''
    });
  };

  const cancelEdit = () => {
    setEditingRole(null);
    setFormData({ name: '', label: '', description: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              Gestión de Roles
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Administra los roles disponibles en el sistema
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Form */}
          <div className="bg-muted/30 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {editingRole ? 'Editar Rol' : 'Crear Nuevo Rol'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Nombre (código)"
                placeholder="BACKEND, FRONTEND, etc."
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value?.toUpperCase() }))}
                disabled={!!editingRole}
                required
              />
              <Input
                label="Etiqueta (nombre visible)"
                placeholder="Desarrollador Backend"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e?.target?.value }))}
                required
              />
            </div>
            <Input
              label="Descripción"
              placeholder="Descripción del rol (opcional)"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
            />
            <div className="flex gap-2 mt-4">
              {editingRole ? (
                <>
                  <Button onClick={handleUpdate} iconName="Save">
                    Guardar Cambios
                  </Button>
                  <Button variant="outline" onClick={cancelEdit} iconName="X">
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={handleCreate} iconName="Plus">
                  Crear Rol
                </Button>
              )}
            </div>
          </div>

          {/* Roles List */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Roles Existentes</h3>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Loader" size={24} className="animate-spin inline" />
                <p className="mt-2">Cargando roles...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-accent transition-smooth"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{role.label}</span>
                        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                          {role.name}
                        </span>
                        {role.isSystem && (
                          <span className="text-xs text-blue-600 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded">
                            Sistema
                          </span>
                        )}
                      </div>
                      {role.description && (
                        <p className="text-xs text-muted-foreground mt-1">{role.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(role)}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-smooth"
                        disabled={role.isSystem}
                        title={role.isSystem ? 'No se pueden editar roles del sistema' : 'Editar rol'}
                      >
                        <Icon name="Pencil" size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(role)}
                        className="p-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/20 rounded transition-smooth"
                        disabled={role.isSystem}
                        title={role.isSystem ? 'No se pueden eliminar roles del sistema' : 'Eliminar rol'}
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemRolesModal;
