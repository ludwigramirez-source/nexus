import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ProductFilterToolbar = ({ onFilterChange, activeFilters }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({ ...activeFilters, [key]: value });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-5 lg:p-6 mb-4 md:mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon name="Filter" size={20} className="text-primary" />
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
          Filtros
        </h3>
        {Object.values(activeFilters).filter(v => v && v !== 'all').length > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-caption font-medium bg-primary text-primary-foreground rounded-full">
            {Object.values(activeFilters).filter(v => v && v !== 'all').length}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {/* Búsqueda */}
        <div>
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={activeFilters?.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Tipo */}
        <div>
          <Select
            options={[
              { value: 'all', label: 'Todos los Tipos' },
              { value: 'PRODUCT', label: 'Productos' },
              { value: 'SERVICE', label: 'Servicios' }
            ]}
            value={activeFilters?.type || 'all'}
            onChange={(value) => handleFilterChange('type', value)}
            placeholder="Tipo"
          />
        </div>

        {/* Estado */}
        <div>
          <Select
            options={[
              { value: 'all', label: 'Todos los Estados' },
              { value: 'ACTIVE', label: 'Activos' },
              { value: 'INACTIVE', label: 'Inactivos' }
            ]}
            value={activeFilters?.status || 'all'}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Estado"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilterToolbar;
