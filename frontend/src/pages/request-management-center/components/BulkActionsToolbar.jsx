import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import usePermissions from '../../../hooks/usePermissions';

const BulkActionsToolbar = ({ selectedCount, onBulkAction, onClearSelection, teamMembers = [] }) => {
  const permissions = usePermissions();
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  // Filtrar acciones disponibles según permisos
  const actionOptions = useMemo(() => {
    const allActions = [
      { value: 'assign', label: 'Asignar a miembro', permission: 'assign_request' },
      { value: 'status', label: 'Cambiar estado', permission: 'change_request_status' },
      { value: 'priority', label: 'Cambiar prioridad', permission: 'change_request_status' },
      { value: 'export', label: 'Exportar selección' }, // No requiere permiso especial
      { value: 'delete', label: 'Eliminar', permission: 'delete_request' }
    ];

    return allActions.filter(action => {
      // Si no tiene permiso requerido, no mostrar la acción
      if (action.permission && !permissions.can(action.permission)) {
        return false;
      }
      return true;
    });
  }, [permissions]);

  const teamMemberOptions = teamMembers?.map(member => ({
    value: member?.id,
    label: member?.name
  }));

  const statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'review', label: 'En Revisión' },
    { value: 'completed', label: 'Completado' }
  ];

  const priorityOptions = [
    { value: 'critical', label: 'Crítica' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' },
    { value: 'low', label: 'Baja' }
  ];

  const handleActionChange = (value) => {
    setSelectedAction(value);
    setSelectedValue(''); // Reset value when action changes
  };

  const handleValueChange = (value) => {
    setSelectedValue(value);
  };

  const handleApplyAction = () => {
    if (selectedAction) {
      // Para acciones que requieren un valor adicional
      if (['assign', 'status', 'priority']?.includes(selectedAction)) {
        if (selectedValue) {
          onBulkAction(selectedAction, selectedValue);
          setSelectedAction('');
          setSelectedValue('');
        }
      } else {
        // Para acciones que no requieren valor adicional
        onBulkAction(selectedAction);
        setSelectedAction('');
      }
    }
  };

  const getSecondaryOptions = () => {
    switch (selectedAction) {
      case 'assign':
        return teamMemberOptions;
      case 'status':
        return statusOptions;
      case 'priority':
        return priorityOptions;
      default:
        return null;
    }
  };

  const secondaryOptions = getSecondaryOptions();
  const needsSecondarySelection = ['assign', 'status', 'priority']?.includes(selectedAction);

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-4 p-4 md:p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full">
              <Icon name="CheckSquare" size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm md:text-base font-caption font-medium text-foreground">
                {selectedCount} solicitud{selectedCount !== 1 ? 'es' : ''} seleccionada{selectedCount !== 1 ? 's' : ''}
              </p>
              <button
                onClick={onClearSelection}
                className="text-xs md:text-sm font-caption text-muted-foreground hover:text-foreground transition-smooth"
              >
                Limpiar selección
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3 w-full md:w-auto">
            <Select
              placeholder="Seleccionar acción"
              options={actionOptions}
              value={selectedAction}
              onChange={handleActionChange}
              className="flex-1 md:w-48"
            />
            
            {needsSecondarySelection && secondaryOptions && (
              <Select
                placeholder={
                  selectedAction === 'assign' ? 'Seleccionar miembro' :
                  selectedAction === 'status' ? 'Seleccionar estado' :
                  'Seleccionar prioridad'
                }
                options={secondaryOptions}
                value={selectedValue}
                onChange={handleValueChange}
                className="flex-1 md:w-48"
              />
            )}
            
            <Button
              variant="default"
              iconName="Play"
              iconPosition="left"
              onClick={handleApplyAction}
              disabled={!selectedAction || (needsSecondarySelection && !selectedValue)}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;