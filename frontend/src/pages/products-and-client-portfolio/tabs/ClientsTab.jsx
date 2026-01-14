import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import ClientTableRow from '../components/ClientTableRow';
import FilterToolbar from '../components/FilterToolbar';
import BulkOperationsBar from '../components/BulkOperationsBar';

const ClientsTab = ({
  clients,
  onCreateClient,
  onViewDetails
}) => {
  const [selectedClients, setSelectedClients] = useState([]);
  const [filters, setFilters] = useState({
    healthScore: 'all',
    tier: 'all',
    mrrRange: 'all',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const filteredClients = useMemo(() => {
    return clients?.filter(client => {
      if (filters?.search && !client?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
        return false;
      }
      if (filters?.healthScore !== 'all') {
        const score = client?.healthScore || 0;
        if (filters.healthScore === 'excellent' && score < 80) return false;
        if (filters.healthScore === 'good' && (score < 60 || score >= 80)) return false;
        if (filters.healthScore === 'warning' && score >= 60) return false;
      }
      if (filters?.tier !== 'all' && client?.tier !== filters.tier) return false;
      return true;
    }) || [];
  }, [clients, filters]);

  const sortedClients = useMemo(() => {
    const sorted = [...filteredClients];
    sorted.sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortConfig.key === 'healthScore') {
        return sortConfig.direction === 'asc'
          ? a.healthScore - b.healthScore
          : b.healthScore - a.healthScore;
      }
      if (sortConfig.key === 'mrr') {
        return sortConfig.direction === 'asc'
          ? a.mrr - b.mrr
          : b.mrr - a.mrr;
      }
      return 0;
    });
    return sorted;
  }, [filteredClients, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    setSelectedClients(checked ? sortedClients.map(c => c.id) : []);
  };

  const handleSelectClient = (id, checked) => {
    setSelectedClients(prev =>
      checked ? [...prev, id] : prev.filter(cId => cId !== id)
    );
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ChevronsUpDown';
    return sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown';
  };

  return (
    <div className="space-y-6">
      <FilterToolbar
        onFilterChange={setFilters}
        onSavePreset={() => {}}
        savedPresets={[]}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Clientes ({sortedClients?.length})
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Exportar
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={onCreateClient}
          >
            Nuevo Cliente
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                  <Checkbox
                    checked={selectedClients?.length === sortedClients?.length && sortedClients?.length > 0}
                    onChange={(e) => handleSelectAll(e?.target?.checked)}
                    indeterminate={selectedClients?.length > 0 && selectedClients?.length < sortedClients?.length}
                  />
                </th>
                <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 text-xs md:text-sm font-caption font-semibold text-foreground hover:text-primary transition-smooth"
                  >
                    <span>Cliente</span>
                    <Icon name={getSortIcon('name')} size={16} />
                  </button>
                </th>
                <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                  <button
                    onClick={() => handleSort('healthScore')}
                    className="flex items-center space-x-1 text-xs md:text-sm font-caption font-semibold text-foreground hover:text-primary transition-smooth"
                  >
                    <span>Salud</span>
                    <Icon name={getSortIcon('healthScore')} size={16} />
                  </button>
                </th>
                <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                  <span className="text-xs md:text-sm font-caption font-semibold text-foreground">
                    Nivel
                  </span>
                </th>
                <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                  <button
                    onClick={() => handleSort('mrr')}
                    className="flex items-center space-x-1 text-xs md:text-sm font-caption font-semibold text-foreground hover:text-primary transition-smooth"
                  >
                    <span>MRR</span>
                    <Icon name={getSortIcon('mrr')} size={16} />
                  </button>
                </th>
                <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                  <span className="text-xs md:text-sm font-caption font-semibold text-foreground">
                    Productos
                  </span>
                </th>
                <th className="px-3 py-3 md:px-4 md:py-4"></th>
              </tr>
            </thead>
            <tbody>
              {sortedClients?.map(client => (
                <React.Fragment key={client?.id}>
                  <tr>
                    <td className="px-3 py-3 md:px-4 md:py-4">
                      <Checkbox
                        checked={selectedClients?.includes(client?.id)}
                        onChange={(e) => handleSelectClient(client?.id, e?.target?.checked)}
                      />
                    </td>
                    <td colSpan={6} className="p-0">
                      <ClientTableRow
                        client={client}
                        onViewDetails={onViewDetails}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {sortedClients?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Icon name="Search" size={48} className="text-muted-foreground mb-3" />
            <p className="text-base font-caption text-foreground font-medium mb-1">
              No se encontraron clientes
            </p>
            <p className="text-sm font-caption text-muted-foreground text-center">
              Intenta ajustar los filtros o buscar con otros términos
            </p>
          </div>
        )}
      </div>

      <BulkOperationsBar
        selectedCount={selectedClients?.length}
        onClearSelection={() => setSelectedClients([])}
      />
    </div>
  );
};

export default ClientsTab;
