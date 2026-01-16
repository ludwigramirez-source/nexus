import React from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterToolbar = ({ filters, onFilterChange }) => {
  const typeOptions = [
    { value: 'all', label: 'Todos los Tipos' },
    { value: 'PRODUCT_FEATURE', label: 'Producto' },
    { value: 'CUSTOMIZATION', label: 'Personalización' },
    { value: 'BUG', label: 'Error' },
    { value: 'SUPPORT', label: 'Soporte' },
    { value: 'INFRASTRUCTURE', label: 'Infraestructura' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'Todas las Prioridades' },
    { value: 'CRITICAL', label: 'Crítico' },
    { value: 'HIGH', label: 'Alto' },
    { value: 'MEDIUM', label: 'Medio' },
    { value: 'LOW', label: 'Bajo' }
  ];

  return (
    <div className="p-4 bg-card border-b border-border">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <Select
            options={typeOptions}
            value={filters?.type}
            onChange={(value) => onFilterChange({ ...filters, type: value })}
            className="w-full sm:w-48"
          />

          <Select
            options={priorityOptions}
            value={filters?.priority}
            onChange={(value) => onFilterChange({ ...filters, priority: value })}
            className="w-full sm:w-48"
          />

          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            onClick={() => onFilterChange({ type: 'all', priority: 'all' })}
          >
            Limpiar
          </Button>

          {(filters?.type !== 'all' || filters?.priority !== 'all') && (
            <span className="text-xs font-caption text-muted-foreground px-2 py-1 bg-primary/10 rounded">
              Filtros activos
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-success"></div>
          <span className="text-xs font-caption text-muted-foreground">Disponible (&lt;60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-accent"></div>
          <span className="text-xs font-caption text-muted-foreground">Cerca de Capacidad (60-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-warning"></div>
          <span className="text-xs font-caption text-muted-foreground">Alta Utilización (80-99%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-error"></div>
          <span className="text-xs font-caption text-muted-foreground">Sobrecargado (≥100%)</span>
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;