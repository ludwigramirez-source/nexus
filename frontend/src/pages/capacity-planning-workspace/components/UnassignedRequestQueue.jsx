import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const UnassignedRequestQueue = ({ requests, onDragStart, onFilterChange, filters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('priority');

  const getPriorityStyle = (priority) => {
    const styles = {
      'CRITICAL': {
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
        border: '2px solid #ef4444',
        fontWeight: '700'
      },
      'HIGH': {
        backgroundColor: '#fef3c7',
        color: '#b45309',
        border: '2px solid #f59e0b',
        fontWeight: '700'
      },
      'MEDIUM': {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        border: '2px solid #3b82f6',
        fontWeight: '600'
      },
      'LOW': {
        backgroundColor: '#f1f5f9',
        color: '#64748b',
        border: '1px solid #cbd5e1',
        fontWeight: '500'
      }
    };
    return styles[priority] || styles['LOW'];
  };

  const getTypeLabel = (type) => {
    const labels = {
      'PRODUCT_FEATURE': 'Producto',
      'CUSTOMIZATION': 'Personalización',
      'BUG': 'Error',
      'SUPPORT': 'Soporte',
      'INFRASTRUCTURE': 'Infraestructura'
    };
    return labels[type] || type;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      'CRITICAL': 'Crítico',
      'HIGH': 'Alto',
      'MEDIUM': 'Medio',
      'LOW': 'Bajo'
    };
    return labels[priority] || priority;
  };

  const getTypeStyle = (type) => {
    const styles = {
      'PRODUCT_FEATURE': {
        backgroundColor: '#d1fae5',
        color: '#047857',
        border: '2px solid #10b981',
        fontWeight: '600'
      },
      'CUSTOMIZATION': {
        backgroundColor: '#ede9fe',
        color: '#6d28d9',
        border: '2px solid #8b5cf6',
        fontWeight: '600'
      },
      'BUG': {
        backgroundColor: '#ffe4e6',
        color: '#be123c',
        border: '2px solid #f43f5e',
        fontWeight: '600'
      },
      'SUPPORT': {
        backgroundColor: '#e0f2fe',
        color: '#0369a1',
        border: '2px solid #0ea5e9',
        fontWeight: '600'
      },
      'INFRASTRUCTURE': {
        backgroundColor: '#f3e8ff',
        color: '#7e22ce',
        border: '2px solid #a855f7',
        fontWeight: '600'
      }
    };
    return styles[type] || styles['SUPPORT'];
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
                <span
                  className="inline-flex items-center px-2.5 py-1 text-xs font-caption rounded-md shadow-sm"
                  style={getPriorityStyle(request?.priority)}
                >
                  {getPriorityLabel(request?.priority)}
                </span>
                <Icon name="GripVertical" size={16} className="text-muted-foreground" />
              </div>

              <h4 className="text-sm font-caption font-medium text-foreground mb-2 line-clamp-2">
                {request?.title}
              </h4>

              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center px-2.5 py-1 text-xs font-caption rounded-md"
                  style={getTypeStyle(request?.type)}
                >
                  {getTypeLabel(request?.type)}
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