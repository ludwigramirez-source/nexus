import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const filterSections = [
    {
      title: 'Tipo de Solicitud',
      key: 'type',
      options: [
        { value: 'product_feature', label: 'Característica de Producto', count: 12 },
        { value: 'customization', label: 'Personalización', count: 8 },
        { value: 'bug', label: 'Error', count: 5 },
        { value: 'support', label: 'Soporte', count: 3 },
        { value: 'infrastructure', label: 'Infraestructura', count: 2 }
      ]
    },
    {
      title: 'Estado',
      key: 'status',
      options: [
        { value: 'pending', label: 'Pendiente', count: 7 },
        { value: 'in_progress', label: 'En Progreso', count: 15 },
        { value: 'review', label: 'En Revisión', count: 4 },
        { value: 'completed', label: 'Completado', count: 4 }
      ]
    },
    {
      title: 'Prioridad',
      key: 'priority',
      options: [
        { value: 'critical', label: 'Crítica', count: 3 },
        { value: 'high', label: 'Alta', count: 8 },
        { value: 'medium', label: 'Media', count: 12 },
        { value: 'low', label: 'Baja', count: 7 }
      ]
    },
    {
      title: 'Miembro del Equipo',
      key: 'assignee',
      options: [
        { value: 'ana', label: 'Ana García', count: 8 },
        { value: 'mario', label: 'Mario López', count: 7 },
        { value: 'laura', label: 'Laura Martínez', count: 6 },
        { value: 'carlos', label: 'Carlos Rodríguez', count: 4 },
        { value: 'unassigned', label: 'Sin Asignar', count: 5 }
      ]
    },
    {
      title: 'Cliente',
      key: 'client',
      options: [
        { value: 'techmex', label: 'TechMex Solutions', count: 6 },
        { value: 'innovatech', label: 'InnovaTech', count: 5 },
        { value: 'dataflow', label: 'DataFlow Systems', count: 4 },
        { value: 'cloudpro', label: 'CloudPro México', count: 3 },
        { value: 'internal', label: 'Interno', count: 12 }
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