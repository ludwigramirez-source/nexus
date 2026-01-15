import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { formatHoursCompact } from '../../../utils/timeFormat';

const KanbanBoard = ({ requests, onRequestMove, onRequestClick }) => {
  const [draggedRequest, setDraggedRequest] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const columns = [
    { id: 'INTAKE', title: 'Intake', color: 'border-secondary' },
    { id: 'BACKLOG', title: 'Backlog', color: 'border-muted' },
    { id: 'IN_PROGRESS', title: 'En Progreso', color: 'border-primary' },
    { id: 'REVIEW', title: 'En Revisión', color: 'border-accent' },
    { id: 'DONE', title: 'Completado', color: 'border-success' }
  ];

  const getTypeColor = (type) => {
    const typeKey = type?.toLowerCase();
    const colors = {
      product_feature: 'bg-success/10 text-success',
      customization: 'bg-accent/10 text-accent',
      bug: 'bg-error/10 text-error',
      support: 'bg-primary/10 text-primary',
      infrastructure: 'bg-secondary/10 text-secondary'
    };
    return colors?.[typeKey] || colors?.support;
  };

  const getTypeLabel = (type) => {
    const typeKey = type?.toLowerCase();
    const labels = {
      product_feature: 'Producto',
      customization: 'Personalización',
      bug: 'Error',
      support: 'Soporte',
      infrastructure: 'Infraestructura'
    };
    return labels?.[typeKey] || type;
  };

  const getPriorityIcon = (priority) => {
    const priorityKey = priority?.toLowerCase();
    const icons = {
      critical: { name: 'AlertCircle', color: 'text-error' },
      high: { name: 'ArrowUp', color: 'text-warning' },
      medium: { name: 'Minus', color: 'text-accent' },
      low: { name: 'ArrowDown', color: 'text-muted-foreground' }
    };
    return icons?.[priorityKey] || icons?.medium;
  };

  const getRequestsByStatus = (status) => {
    return requests?.filter(r => r?.status === status);
  };

  // Drag and Drop handlers
  const handleDragStart = (e, request) => {
    setDraggedRequest(request);
    e.dataTransfer.effectAllowed = 'move';
    e?.dataTransfer?.setData('text/html', e?.target);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedRequest(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, columnId) => {
    e?.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e) => {
    // Only clear if leaving the column container itself
    if (e?.currentTarget === e?.target) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, targetColumnId) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (draggedRequest && draggedRequest?.status !== targetColumnId) {
      // Call the parent handler to update the request status
      if (onRequestMove) {
        onRequestMove(draggedRequest?.id, targetColumnId);
      }
    }
    
    setDraggedRequest(null);
    setDragOverColumn(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 h-full">
      {columns?.map((column) => {
        const columnRequests = getRequestsByStatus(column?.id);
        const isDropTarget = dragOverColumn === column?.id;
        
        return (
          <div 
            key={column?.id} 
            className="flex flex-col bg-muted/30 rounded-lg border border-border"
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column?.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column?.id)}
          >
            <div className={`p-3 md:p-4 border-b-2 ${column?.color} bg-card`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm md:text-base font-heading font-semibold text-foreground">
                  {column?.title}
                </h3>
                <span className="px-2 py-0.5 text-xs font-caption font-medium bg-muted text-muted-foreground rounded-full">
                  {columnRequests?.length}
                </span>
              </div>
            </div>
            <div 
              className={`flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 transition-colors ${
                isDropTarget ? 'bg-primary/5 border-2 border-primary border-dashed' : ''
              }`}
            >
              {columnRequests?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 md:py-12">
                  <Icon name="Inbox" size={40} className="text-muted-foreground mb-2" />
                  <p className="text-xs md:text-sm font-caption text-muted-foreground text-center">
                    {isDropTarget ? 'Suelta aquí' : 'No hay solicitudes'}
                  </p>
                </div>
              ) : (
                columnRequests?.map((request) => (
                  <div
                    key={request?.id}
                    className="bg-card border border-border rounded-lg p-3 md:p-4 hover:shadow-elevation-2 transition-smooth cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, request)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onRequestClick && onRequestClick(request?.id)}
                  >
                    <div className="flex items-start justify-between mb-2 md:mb-3">
                      <span className="text-xs font-caption font-medium text-muted-foreground data-text">
                        {request?.requestNumber || `#${request?.id?.substring(0, 8)}`}
                      </span>
                      <Icon
                        name={getPriorityIcon(request?.priority)?.name}
                        size={16}
                        className={getPriorityIcon(request?.priority)?.color}
                      />
                    </div>

                    <h4 className="text-sm md:text-base font-caption font-medium text-foreground mb-2 line-clamp-2">
                      {request?.title}
                    </h4>

                    <p className="text-xs md:text-sm font-caption text-muted-foreground mb-3 md:mb-4 line-clamp-2">
                      {request?.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-caption font-medium rounded-md ${getTypeColor(request?.type)}`}>
                        {getTypeLabel(request?.type)}
                      </span>
                      <span className="text-xs font-caption text-muted-foreground">
                        {request?.client?.name || request?.clientName || '-'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      {request?.assignedUsers && request?.assignedUsers?.length > 0 ? (
                        <div className="flex items-center -space-x-2">
                          {request?.assignedUsers?.slice(0, 2)?.map((user) => (
                            <div
                              key={user?.id}
                              className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center"
                              title={user?.name}
                            >
                              <span className="text-xs font-medium text-foreground">
                                {user?.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                          ))}
                          {request?.assignedUsers?.length > 2 && (
                            <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center">
                              <span className="text-xs font-medium text-foreground">
                                +{request?.assignedUsers?.length - 2}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-caption text-muted-foreground">Sin asignar</span>
                      )}
                      <div className="flex items-center space-x-2">
                        <Icon name="Clock" size={14} className="text-muted-foreground" />
                        <span className="text-xs font-caption text-foreground data-text">
                          {formatHoursCompact(request?.actualHours || 0)}/{formatHoursCompact(request?.estimatedHours)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;