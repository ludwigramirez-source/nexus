import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const UnassignedRequestQueue = ({ requests, onDragStart, onFilterChange, filters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('priority');

  const priorityColors = {
    'Crítico': 'bg-error/10 text-error border-error/20',
    'Alto': 'bg-warning/10 text-warning border-warning/20',
    'Medio': 'bg-accent/10 text-accent border-accent/20',
    'Bajo': 'bg-muted text-muted-foreground border-border'
  };

  const typeColors = {
    'Producto': 'bg-success/10 text-success',
    'Personalización': 'bg-accent/10 text-accent',
    'Error': 'bg-error/10 text-error',
    'Soporte': 'bg-primary/10 text-primary',
    'Infraestructura': 'bg-secondary/10 text-secondary'
  };

  const filteredRequests = requests?.filter(req => 
      req?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) &&
      (filters?.type === 'all' || req?.type === filters?.type) &&
      (filters?.priority === 'all' || req?.priority === filters?.priority)
    )?.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { 'Crítico': 0, 'Alto': 1, 'Medio': 2, 'Bajo': 3 };
        return priorityOrder?.[a?.priority] - priorityOrder?.[b?.priority];
      }
      if (sortBy === 'hours') {
        return b?.estimatedHours - a?.estimatedHours;
      }
      return 0;
    });

  const handleDragStart = (e, request) => {
    e.dataTransfer.effectAllowed = 'move';
    e?.dataTransfer?.setData('application/json', JSON.stringify(request));
    if (onDragStart) {
      onDragStart(request);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="text-base font-heading font-semibold text-foreground mb-3">
          Solicitudes Sin Asignar
        </h3>
        
        <div className="relative mb-3">
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Buscar solicitudes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-10 pr-3 py-2 text-sm font-caption bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="flex-1 px-3 py-2 text-sm font-caption bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="priority">Ordenar por Prioridad</option>
            <option value="hours">Ordenar por Horas</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs font-caption text-muted-foreground">
          <span>{filteredRequests?.length} solicitudes</span>
          <span>{filteredRequests?.reduce((sum, req) => sum + req?.estimatedHours, 0)}h total</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredRequests?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Icon name="Inbox" size={48} className="text-muted-foreground mb-3" />
            <p className="text-sm font-caption text-muted-foreground text-center">
              No hay solicitudes sin asignar
            </p>
          </div>
        ) : (
          filteredRequests?.map((request) => (
            <div
              key={request?.id}
              draggable
              onDragStart={(e) => handleDragStart(e, request)}
              className="p-3 bg-background border border-border rounded-lg cursor-move hover:shadow-elevation-2 transition-smooth"
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-0.5 text-xs font-caption font-medium rounded ${priorityColors?.[request?.priority]}`}>
                  {request?.priority}
                </span>
                <Icon name="GripVertical" size={16} className="text-muted-foreground" />
              </div>

              <h4 className="text-sm font-caption font-medium text-foreground mb-2 line-clamp-2">
                {request?.title}
              </h4>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 text-xs font-caption font-medium rounded ${typeColors?.[request?.type]}`}>
                  {request?.type}
                </span>
                <div className="flex items-center gap-1 text-xs font-caption text-muted-foreground">
                  <Icon name="Clock" size={14} />
                  <span>{request?.estimatedHours}h</span>
                </div>
              </div>

              {request?.skills && request?.skills?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {request?.skills?.slice(0, 2)?.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-xs font-caption bg-muted text-muted-foreground rounded">
                      {skill}
                    </span>
                  ))}
                  {request?.skills?.length > 2 && (
                    <span className="px-2 py-0.5 text-xs font-caption bg-muted text-muted-foreground rounded">
                      +{request?.skills?.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UnassignedRequestQueue;