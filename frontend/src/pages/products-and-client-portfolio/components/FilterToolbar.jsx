import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterToolbar = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState({
    healthScore: 'all',
    tier: 'all',
    mrrRange: 'all',
    search: ''
  });

  const healthScoreOptions = [
    { value: 'all', label: 'Todos los Scores' },
    { value: 'excellent', label: 'Excelente (80-100)' },
    { value: 'good', label: 'Bueno (60-79)' },
    { value: 'fair', label: 'Regular (40-59)' },
    { value: 'risk', label: 'En Riesgo (0-39)' }
  ];

  const tierOptions = [
    { value: 'all', label: 'Todos los Niveles' },
    { value: 'ENTERPRISE', label: 'Enterprise' },
    { value: 'PRO', label: 'Professional' },
    { value: 'BASIC', label: 'Básico' }
  ];

  const mrrRangeOptions = [
    { value: 'all', label: 'Todos los Rangos' },
    { value: 'high', label: 'Alto (> $10,000)' },
    { value: 'medium', label: 'Medio ($1,000 - $10,000)' },
    { value: 'low', label: 'Bajo (< $1,000)' }
  ];


  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };


  const activeFilterCount = Object.values(activeFilters)?.filter(
    (value) => value !== 'all' && value !== ''
  )?.length;

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-5 lg:p-6 mb-4 md:mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon name="Filter" size={20} className="text-primary" />
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
          Filtros
        </h3>
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-caption font-medium bg-primary text-primary-foreground rounded-full">
            {activeFilterCount}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div>
          <Input
            type="search"
            placeholder="Buscar clientes..."
            value={activeFilters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
          />
        </div>

        <div>
          <Select
            options={healthScoreOptions}
            value={activeFilters?.healthScore}
            onChange={(value) => handleFilterChange('healthScore', value)}
            placeholder="Score de Salud"
          />
        </div>

        <div>
          <Select
            options={tierOptions}
            value={activeFilters?.tier}
            onChange={(value) => handleFilterChange('tier', value)}
            placeholder="Nivel de Cliente"
          />
        </div>

        <div>
          <Select
            options={mrrRangeOptions}
            value={activeFilters?.mrrRange}
            onChange={(value) => handleFilterChange('mrrRange', value)}
            placeholder="Rango de MRR"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;