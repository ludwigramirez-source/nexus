import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, requests = [], users = [], clients = [] }) => {
  // Calcular counts dinámicamente
  const getCountForType = (type) => {
    return requests.filter(r => r.type === type).length;
  };

  const getCountForStatus = (status) => {
    return requests.filter(r => r.status === status).length;
  };

  const getCountForPriority = (priority) => {
    return requests.filter(r => r.priority === priority).length;
  };

  const getCountForUser = (userId) => {
    if (userId === 'unassigned') {
      return requests.filter(r => !r.assignedUsers || r.assignedUsers.length === 0).length;
    }
    return requests.filter(r =>
      r.assignedUsers && r.assignedUsers.some(u => u.id === userId)
    ).length;
  };

  const getCountForClient = (clientId) => {
    return requests.filter(r => r.clientId === clientId || r.client?.id === clientId).length;
  };

  const filterSections = [
    {
      title: 'Tipo de Solicitud',
      key: 'type',
      options: [
        { value: 'PRODUCT_FEATURE', label: 'Característica de Producto', count: getCountForType('PRODUCT_FEATURE') },
        { value: 'CUSTOMIZATION', label: 'Personalización', count: getCountForType('CUSTOMIZATION') },
        { value: 'BUG', label: 'Error', count: getCountForType('BUG') },
        { value: 'SUPPORT', label: 'Soporte', count: getCountForType('SUPPORT') },
        { value: 'INFRASTRUCTURE', label: 'Infraestructura', count: getCountForType('INFRASTRUCTURE') }
      ]
    },
    {
      title: 'Estado',
      key: 'status',
      options: [
        { value: 'INTAKE', label: 'Intake', count: getCountForStatus('INTAKE') },
        { value: 'BACKLOG', label: 'Backlog', count: getCountForStatus('BACKLOG') },
        { value: 'IN_PROGRESS', label: 'En Progreso', count: getCountForStatus('IN_PROGRESS') },
        { value: 'REVIEW', label: 'En Revisión', count: getCountForStatus('REVIEW') },
        { value: 'DONE', label: 'Completado', count: getCountForStatus('DONE') },
        { value: 'REJECTED', label: 'Rechazado', count: getCountForStatus('REJECTED') }
      ]
    },
    {
      title: 'Prioridad',
      key: 'priority',
      options: [
        { value: 'CRITICAL', label: 'Crítica', count: getCountForPriority('CRITICAL') },
        { value: 'HIGH', label: 'Alta', count: getCountForPriority('HIGH') },
        { value: 'MEDIUM', label: 'Media', count: getCountForPriority('MEDIUM') },
        { value: 'LOW', label: 'Baja', count: getCountForPriority('LOW') }
      ]
    }
  ];

  const handleCheckboxChange = (sectionKey, optionValue, checked) => {
    const currentValues = filters?.[sectionKey] || [];
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues?.filter(v => v !== optionValue);
    
    onFilterChange(sectionKey, newValues);
  };

  const isChecked = (sectionKey, optionValue) => {
    return (filters?.[sectionKey] || [])?.includes(optionValue);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters)?.reduce((sum, arr) => sum + (arr?.length || 0), 0);
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <div className="flex items-center justify-between p-4 md:p-5 lg:p-6 border-b border-border">
        <div className="flex items-center space-x-2 md:space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h2 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Filtros
          </h2>
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-0.5 text-xs font-caption font-medium bg-primary text-primary-foreground rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs md:text-sm font-caption text-error hover:text-error/80 transition-smooth"
          >
            Limpiar
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-5 lg:p-6 space-y-4 md:space-y-5 lg:space-y-6">
        {filterSections?.map((section) => (
          <div key={section?.key} className="space-y-2 md:space-y-3">
            <h3 className="text-sm md:text-base font-caption font-medium text-foreground">
              {section?.title}
            </h3>
            <div className="space-y-2">
              {section?.options?.map((option) => (
                <div key={option?.value} className="flex items-center justify-between">
                  <Checkbox
                    label={option?.label}
                    checked={isChecked(section?.key, option?.value)}
                    onChange={(e) => handleCheckboxChange(section?.key, option?.value, e?.target?.checked)}
                    size="sm"
                  />
                  <span className="text-xs font-caption text-muted-foreground">
                    {option?.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;