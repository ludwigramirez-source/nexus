import React from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterBar = ({
  filters,
  onFilterChange,
  onClearFilters,
  onExport,
  activeTab,
  okrs = [],
  roadmapFeatures = []
}) => {
  // Generate dynamic owner options from actual OKRs data
  const ownerOptions = [
    { value: 'all', label: 'Todos los propietarios' },
    ...Array.from(new Set(okrs.map(okr => okr.owner?.name).filter(Boolean)))
      .map(name => ({ value: name, label: name }))
  ];

  // OKR Status options (backend: NOT_STARTED, ON_TRACK, AT_RISK, BEHIND, COMPLETED)
  const okrStatusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'NOT_STARTED', label: 'No iniciado' },
    { value: 'ON_TRACK', label: 'En camino' },
    { value: 'AT_RISK', label: 'En riesgo' },
    { value: 'BEHIND', label: 'Atrasado' },
    { value: 'COMPLETED', label: 'Completado' }
  ];

  // Roadmap Status options (backend: PLANNED, IN_PROGRESS, DONE)
  const roadmapStatusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'planned', label: 'Planeado' },
    { value: 'in-progress', label: 'En progreso' },
    { value: 'done', label: 'Completado' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'Todas las prioridades' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' },
    { value: 'low', label: 'Baja' }
  ];

  // Generate dynamic quarter options
  const quarterOptions = [
    { value: 'all', label: 'Todos los trimestres' },
    ...Array.from(new Set([
      ...okrs.map(okr => `${okr.quarter} ${okr.year}`).filter(Boolean),
      ...roadmapFeatures.map(f => f.quarter).filter(Boolean)
    ])).sort().map(q => ({ value: q, label: q }))
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
          {activeTab === 'okrs' ? (
            <>
              {/* OKR Filters */}
              <Select
                options={ownerOptions}
                value={filters?.owner}
                onChange={(value) => onFilterChange('owner', value)}
                placeholder="Propietario"
              />
              <Select
                options={quarterOptions}
                value={filters?.quarter}
                onChange={(value) => onFilterChange('quarter', value)}
                placeholder="Trimestre"
              />
              <Select
                options={okrStatusOptions}
                value={filters?.status}
                onChange={(value) => onFilterChange('status', value)}
                placeholder="Estado"
              />
            </>
          ) : (
            <>
              {/* Roadmap Filters */}
              <Select
                options={quarterOptions}
                value={filters?.quarter}
                onChange={(value) => onFilterChange('quarter', value)}
                placeholder="Trimestre"
              />
              <Select
                options={roadmapStatusOptions}
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
            </>
          )}
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