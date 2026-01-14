import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickFilters = ({ activeFilters, onFilterChange, onExport, onRefresh }) => {
  const dateRanges = [
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mes' },
    { value: 'quarter', label: 'Este Trimestre' },
    { value: 'year', label: 'Este Año' }
  ];

  const teams = [
    { value: 'all', label: 'Todos los Equipos' },
    { value: 'backend', label: 'Backend' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'management', label: 'Gestión' }
  ];

  const views = [
    { value: 'overview', label: 'Vista General', icon: 'LayoutDashboard' },
    { value: 'capacity', label: 'Capacidad', icon: 'Users' },
    { value: 'financial', label: 'Financiero', icon: 'DollarSign' },
    { value: 'requests', label: 'Solicitudes', icon: 'Inbox' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-3 md:p-4 shadow-elevation-1 mb-4 md:mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 md:gap-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground md:w-5 md:h-5" />
            <select
              value={activeFilters?.dateRange}
              onChange={(e) => onFilterChange({ ...activeFilters, dateRange: e?.target?.value })}
              className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-caption border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {dateRanges?.map(range => (
                <option key={range?.value} value={range?.value}>
                  {range?.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Icon name="Users" size={16} className="text-muted-foreground md:w-5 md:h-5" />
            <select
              value={activeFilters?.team}
              onChange={(e) => onFilterChange({ ...activeFilters, team: e?.target?.value })}
              className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-caption border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {teams?.map(team => (
                <option key={team?.value} value={team?.value}>
                  {team?.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {views?.map(view => (
            <button
              key={view?.value}
              onClick={() => onFilterChange({ ...activeFilters, view: view?.value })}
              className={`
                flex items-center space-x-1.5 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-caption font-medium transition-smooth
                ${activeFilters?.view === view?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              <Icon name={view?.icon} size={14} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">{view?.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={onRefresh}
            className="flex-shrink-0"
          >
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={onExport}
            className="flex-shrink-0"
          >
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickFilters;