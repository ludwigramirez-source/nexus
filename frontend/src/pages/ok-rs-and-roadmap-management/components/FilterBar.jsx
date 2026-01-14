import React from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterBar = ({ filters, onFilterChange, onClearFilters, onExport }) => {
  const ownerOptions = [
    { value: 'all', label: 'Todos los propietarios' },
    { value: 'Ludwig Schmidt', label: 'Ludwig Schmidt' },
    { value: 'Carlos Mendoza', label: 'Carlos Mendoza' },
    { value: 'Ana Torres', label: 'Ana Torres' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'Todos los departamentos' },
    { value: 'Desarrollo', label: 'Desarrollo' },
    { value: 'Producto', label: 'Producto' },
    { value: 'Ventas', label: 'Ventas' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'on-track', label: 'En camino' },
    { value: 'at-risk', label: 'En riesgo' },
    { value: 'off-track', label: 'Fuera de camino' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'Todas las prioridades' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' },
    { value: 'low', label: 'Baja' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
          <Select
            options={ownerOptions}
            value={filters?.owner}
            onChange={(value) => onFilterChange('owner', value)}
            placeholder="Propietario"
          />
          <Select
            options={departmentOptions}
            value={filters?.department}
            onChange={(value) => onFilterChange('department', value)}
            placeholder="Departamento"
          />
          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => onFilterChange('status', value)}
            placeholder="Estado"
          />
          <Select
            options={priorityOptions}
            value={filters?.priority}
            onChange={(value) => onFilterChange('priority', value)}
            placeholder="Prioridad"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={16}
          >
            Limpiar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
          >
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;