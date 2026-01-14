import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ onApplyFilters, onResetFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    teamMember: 'all',
    clientTier: 'all',
    metricType: 'all',
    customStartDate: '',
    customEndDate: ''
  });

  const dateRangeOptions = [
    { value: 'last7days', label: 'Últimos 7 días' },
    { value: 'last30days', label: 'Últimos 30 días' },
    { value: 'last90days', label: 'Últimos 90 días' },
    { value: 'thisQuarter', label: 'Este trimestre' },
    { value: 'lastQuarter', label: 'Trimestre anterior' },
    { value: 'thisYear', label: 'Este año' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const teamMemberOptions = [
    { value: 'all', label: 'Todos los miembros' },
    { value: 'ludwig', label: 'Ludwig Schmidt (CEO)' },
    { value: 'carlos', label: 'Carlos Mendoza (Director)' },
    { value: 'ana', label: 'Ana García (Backend)' },
    { value: 'mario', label: 'Mario López (Backend)' },
    { value: 'laura', label: 'Laura Martínez (Frontend)' }
  ];

  const clientTierOptions = [
    { value: 'all', label: 'Todos los niveles' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'professional', label: 'Professional' },
    { value: 'starter', label: 'Starter' }
  ];

  const metricTypeOptions = [
    { value: 'all', label: 'Todas las métricas' },
    { value: 'capacity', label: 'Capacidad' },
    { value: 'velocity', label: 'Velocidad' },
    { value: 'financial', label: 'Financiero' },
    { value: 'quality', label: 'Calidad' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      dateRange: 'last30days',
      teamMember: 'all',
      clientTier: 'all',
      metricType: 'all',
      customStartDate: '',
      customEndDate: ''
    };
    setFilters(resetFilters);
    onResetFilters();
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 mb-4 md:mb-6">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Filtros Avanzados
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Ocultar' : 'Mostrar'}
        </Button>
      </div>
      {isExpanded && (
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Select
              label="Rango de fechas"
              options={dateRangeOptions}
              value={filters?.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
            />

            <Select
              label="Miembro del equipo"
              options={teamMemberOptions}
              value={filters?.teamMember}
              onChange={(value) => handleFilterChange('teamMember', value)}
            />

            <Select
              label="Nivel de cliente"
              options={clientTierOptions}
              value={filters?.clientTier}
              onChange={(value) => handleFilterChange('clientTier', value)}
            />

            <Select
              label="Tipo de métrica"
              options={metricTypeOptions}
              value={filters?.metricType}
              onChange={(value) => handleFilterChange('metricType', value)}
            />
          </div>

          {filters?.dateRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Fecha de inicio"
                type="date"
                value={filters?.customStartDate}
                onChange={(e) => handleFilterChange('customStartDate', e?.target?.value)}
              />
              <Input
                label="Fecha de fin"
                type="date"
                value={filters?.customEndDate}
                onChange={(e) => handleFilterChange('customEndDate', e?.target?.value)}
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              variant="default"
              iconName="Check"
              iconPosition="left"
              onClick={handleApply}
              className="w-full sm:w-auto"
            >
              Aplicar Filtros
            </Button>
            <Button
              variant="outline"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              Restablecer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;