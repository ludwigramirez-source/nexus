import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const FunnelFilterToolbar = ({ clients, onFilterChange, loading }) => {
  const [filters, setFilters] = useState({
    clientId: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    currency: '',
    search: ''
  });

  const isFirstRender = useRef(true);

  // Update parent when filters change (skip first render)
  useEffect(() => {
    // Skip the initial render to avoid infinite loop
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const activeFilters = {};

    if (filters.clientId) activeFilters.clientId = filters.clientId;
    if (filters.dateFrom) activeFilters.dateFrom = filters.dateFrom;
    if (filters.dateTo) activeFilters.dateTo = filters.dateTo;
    if (filters.minAmount) activeFilters.minAmount = parseFloat(filters.minAmount);
    if (filters.maxAmount) activeFilters.maxAmount = parseFloat(filters.maxAmount);
    if (filters.currency) activeFilters.currency = filters.currency;
    if (filters.search) activeFilters.search = filters.search;

    onFilterChange(activeFilters);
  }, [filters, onFilterChange]);

  const handleInputChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      clientId: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
      currency: '',
      search: ''
    });
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  // Get client name by ID
  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente';
  };

  // Format currency label
  const getCurrencyLabel = (currency) => {
    const labels = {
      USD: 'USD ($)',
      COP: 'COP ($)'
    };
    return labels[currency] || currency;
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Icon
              name="Search"
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Buscar por número de cotización..."
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Client Filter */}
        <select
          value={filters.clientId}
          onChange={(e) => handleInputChange('clientId', e.target.value)}
          className="px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[150px]"
          disabled={loading}
        >
          <option value="">Todos los clientes</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        {/* Currency Filter */}
        <select
          value={filters.currency}
          onChange={(e) => handleInputChange('currency', e.target.value)}
          className="px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todas las monedas</option>
          <option value="USD">USD ($)</option>
          <option value="COP">COP ($)</option>
        </select>

        {/* Date From */}
        <div className="flex items-center gap-2">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleInputChange('dateFrom', e.target.value)}
            className="px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Desde"
          />
        </div>

        {/* Date To */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">-</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleInputChange('dateTo', e.target.value)}
            className="px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Hasta"
          />
        </div>

        {/* Amount Range */}
        <div className="flex items-center gap-2">
          <Icon name="DollarSign" size={16} className="text-muted-foreground" />
          <input
            type="number"
            value={filters.minAmount}
            onChange={(e) => handleInputChange('minAmount', e.target.value)}
            placeholder="Mín"
            className="w-24 px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <span className="text-muted-foreground text-sm">-</span>
          <input
            type="number"
            value={filters.maxAmount}
            onChange={(e) => handleInputChange('maxAmount', e.target.value)}
            placeholder="Máx"
            className="w-24 px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Clear Filters Button */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm font-medium transition-colors"
          >
            <Icon name="X" size={16} />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>

          {filters.clientId && (
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <Icon name="Building2" size={14} />
              <span>{getClientName(filters.clientId)}</span>
              <button
                onClick={() => handleInputChange('clientId', '')}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {filters.currency && (
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <Icon name="DollarSign" size={14} />
              <span>{getCurrencyLabel(filters.currency)}</span>
              <button
                onClick={() => handleInputChange('currency', '')}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {(filters.dateFrom || filters.dateTo) && (
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <Icon name="Calendar" size={14} />
              <span>
                {filters.dateFrom && new Date(filters.dateFrom).toLocaleDateString('es-ES')}
                {filters.dateFrom && filters.dateTo && ' - '}
                {filters.dateTo && new Date(filters.dateTo).toLocaleDateString('es-ES')}
              </span>
              <button
                onClick={() => {
                  handleInputChange('dateFrom', '');
                  handleInputChange('dateTo', '');
                }}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {(filters.minAmount || filters.maxAmount) && (
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <Icon name="DollarSign" size={14} />
              <span>
                {filters.minAmount && `$${filters.minAmount}`}
                {filters.minAmount && filters.maxAmount && ' - '}
                {filters.maxAmount && `$${filters.maxAmount}`}
              </span>
              <button
                onClick={() => {
                  handleInputChange('minAmount', '');
                  handleInputChange('maxAmount', '');
                }}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {filters.search && (
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <Icon name="Search" size={14} />
              <span>{filters.search}</span>
              <button
                onClick={() => handleInputChange('search', '')}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FunnelFilterToolbar;
