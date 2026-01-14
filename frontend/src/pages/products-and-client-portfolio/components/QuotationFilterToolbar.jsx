import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuotationFilterToolbar = ({ onFilterChange, activeFilters, clients }) => {
  // Status options
  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'DRAFT', label: 'Borrador' },
    { value: 'SENT', label: 'Enviada' },
    { value: 'ACCEPTED', label: 'Aceptada' },
    { value: 'REJECTED', label: 'Rechazada' },
    { value: 'EXPIRED', label: 'Vencida' },
    { value: 'CONVERTED_TO_ORDER', label: 'Convertida en Venta' }
  ];

  // Client options
  const clientOptions = [
    { value: 'all', label: 'Todos los clientes' },
    ...(clients?.map((client) => ({
      value: client?.id,
      label: client?.name
    })) || [])
  ];

  // Date range options
  const dateRangeOptions = [
    { value: 'all', label: 'Todo el tiempo' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'quarter', label: 'Este trimestre' },
    { value: 'year', label: 'Este año' },
    { value: 'custom', label: 'Personalizado' }
  ];

  // Handle filter change
  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...activeFilters,
      [key]: value
    });
  };

  // Calculate date range
  const calculateDateRange = (range) => {
    const now = new Date();
    let dateFrom = null;
    let dateTo = null;

    switch (range) {
      case 'today':
        dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        dateTo = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'week':
        dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        dateTo = now;
        break;
      case 'month':
        dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
        dateTo = now;
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        dateFrom = new Date(now.getFullYear(), quarter * 3, 1);
        dateTo = now;
        break;
      case 'year':
        dateFrom = new Date(now.getFullYear(), 0, 1);
        dateTo = now;
        break;
      default:
        dateFrom = null;
        dateTo = null;
    }

    return { dateFrom, dateTo };
  };

  // Handle date range change
  const handleDateRangeChange = (range) => {
    if (range === 'custom') {
      onFilterChange({
        ...activeFilters,
        dateRange: range,
        dateFrom: '',
        dateTo: ''
      });
    } else {
      const { dateFrom, dateTo } = calculateDateRange(range);
      onFilterChange({
        ...activeFilters,
        dateRange: range,
        dateFrom: dateFrom ? dateFrom.toISOString() : null,
        dateTo: dateTo ? dateTo.toISOString() : null
      });
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    onFilterChange({
      status: 'all',
      clientId: 'all',
      dateRange: 'all',
      dateFrom: null,
      dateTo: null,
      search: ''
    });
  };

  // Count active filters
  const activeFilterCount = [
    activeFilters?.status !== 'all',
    activeFilters?.clientId !== 'all',
    activeFilters?.dateRange !== 'all',
    activeFilters?.search?.length > 0
  ].filter(Boolean).length;

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            type="text"
            placeholder="Buscar por número o cliente..."
            value={activeFilters?.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            prefix={<Icon name="Search" size={16} />}
          />
        </div>

        {/* Status Filter */}
        <div>
          <Select
            options={statusOptions}
            value={activeFilters?.status || 'all'}
            onChange={(val) => handleFilterChange('status', val)}
            placeholder="Filtrar por estado"
          />
        </div>

        {/* Client Filter */}
        <div>
          <Select
            options={clientOptions}
            value={activeFilters?.clientId || 'all'}
            onChange={(val) => handleFilterChange('clientId', val)}
            placeholder="Filtrar por cliente"
          />
        </div>

        {/* Date Range Filter */}
        <div>
          <Select
            options={dateRangeOptions}
            value={activeFilters?.dateRange || 'all'}
            onChange={handleDateRangeChange}
            placeholder="Filtrar por fecha"
          />
        </div>

        {/* Custom Date Range Inputs */}
        {activeFilters?.dateRange === 'custom' && (
          <>
            <div>
              <Input
                type="date"
                label="Desde"
                value={activeFilters?.dateFrom ? activeFilters.dateFrom.split('T')[0] : ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            </div>
            <div>
              <Input
                type="date"
                label="Hasta"
                value={activeFilters?.dateTo ? activeFilters.dateTo.split('T')[0] : ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            </div>
          </>
        )}

        {/* Clear Filters Button */}
        {activeFilterCount > 0 && (
          <div className="lg:col-span-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={handleClearFilters}
            >
              Limpiar Filtros ({activeFilterCount})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationFilterToolbar;
