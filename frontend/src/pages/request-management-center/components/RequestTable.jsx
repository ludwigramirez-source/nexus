import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { formatHoursCompact } from '../../../utils/timeFormat';

const RequestTable = ({ requests, onRequestSelect, selectedRequests, onBulkAction, onInlineEdit, onRequestClick, onEditRequest, onDeleteRequest }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [editingCell, setEditingCell] = useState(null);

  const getTypeColor = (type) => {
    const typeKey = type?.toLowerCase();
    const colors = {
      product_feature: 'bg-success/10 text-success border-success/20',
      customization: 'bg-accent/10 text-accent border-accent/20',
      bug: 'bg-error/10 text-error border-error/20',
      support: 'bg-primary/10 text-primary border-primary/20',
      infrastructure: 'bg-secondary/10 text-secondary border-secondary/20'
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

  const getStatusColor = (status) => {
    const statusKey = status?.toLowerCase();
    const colors = {
      intake: 'bg-secondary/10 text-secondary border-secondary/20',
      backlog: 'bg-muted text-muted-foreground',
      in_progress: 'bg-primary/10 text-primary',
      review: 'bg-accent/10 text-accent',
      done: 'bg-success/10 text-success',
      rejected: 'bg-error/10 text-error'
    };
    return colors?.[statusKey] || colors?.backlog;
  };

  const getStatusLabel = (status) => {
    const statusKey = status?.toLowerCase();
    const labels = {
      intake: 'Intake',
      backlog: 'Backlog',
      in_progress: 'En Progreso',
      review: 'En Revisión',
      done: 'Completado',
      rejected: 'Rechazado'
    };
    return labels?.[statusKey] || status;
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

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      onRequestSelect(requests?.map(r => r?.id));
    } else {
      onRequestSelect([]);
    }
  };

  const handleSelectRequest = (id) => {
    if (selectedRequests?.includes(id)) {
      onRequestSelect(selectedRequests?.filter(r => r !== id));
    } else {
      onRequestSelect([...selectedRequests, id]);
    }
  };

  const handleInlineEdit = (requestId, field, value) => {
    onInlineEdit(requestId, field, value);
    setEditingCell(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-muted/50 sticky top-0 z-10">
          <tr>
            <th className="p-3 md:p-4 text-left">
              <input
                type="checkbox"
                checked={selectedRequests?.length === requests?.length && requests?.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
              />
            </th>
            <th className="p-3 md:p-4 text-left">
              <button
                onClick={() => handleSort('requestNumber')}
                className="flex items-center space-x-1 text-xs md:text-sm font-caption font-medium text-foreground hover:text-primary transition-smooth"
              >
                <span>Número</span>
                <Icon name="ArrowUpDown" size={14} />
              </button>
            </th>
            <th className="p-3 md:p-4 text-left min-w-[200px] md:min-w-[250px]">
              <button
                onClick={() => handleSort('title')}
                className="flex items-center space-x-1 text-xs md:text-sm font-caption font-medium text-foreground hover:text-primary transition-smooth"
              >
                <span>Título</span>
                <Icon name="ArrowUpDown" size={14} />
              </button>
            </th>
            <th className="p-3 md:p-4 text-left">
              <span className="text-xs md:text-sm font-caption font-medium text-foreground">Tipo</span>
            </th>
            <th className="p-3 md:p-4 text-left">
              <span className="text-xs md:text-sm font-caption font-medium text-foreground">Prioridad</span>
            </th>
            <th className="p-3 md:p-4 text-left">
              <span className="text-xs md:text-sm font-caption font-medium text-foreground">Asignado</span>
            </th>
            <th className="p-3 md:p-4 text-left">
              <span className="text-xs md:text-sm font-caption font-medium text-foreground">Horas Est.</span>
            </th>
            <th className="p-3 md:p-4 text-left">
              <span className="text-xs md:text-sm font-caption font-medium text-foreground">Estado</span>
            </th>
            <th className="p-3 md:p-4 text-left">
              <span className="text-xs md:text-sm font-caption font-medium text-foreground">Cliente</span>
            </th>
            <th className="p-3 md:p-4 text-left">
              <button
                onClick={() => handleSort('lastUpdate')}
                className="flex items-center space-x-1 text-xs md:text-sm font-caption font-medium text-foreground hover:text-primary transition-smooth"
              >
                <span>Última Act.</span>
                <Icon name="ArrowUpDown" size={14} />
              </button>
            </th>
            <th className="p-3 md:p-4 text-right">
              <span className="text-xs md:text-sm font-caption font-medium text-foreground">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {requests?.map((request) => (
            <tr
              key={request?.id}
              className={`hover:bg-muted/30 transition-smooth ${
                selectedRequests?.includes(request?.id) ? 'bg-primary/5' : ''
              }`}
            >
              <td className="p-3 md:p-4">
                <input
                  type="checkbox"
                  checked={selectedRequests?.includes(request?.id)}
                  onChange={() => handleSelectRequest(request?.id)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                />
              </td>
              <td
                className="p-3 md:p-4 cursor-pointer hover:text-primary transition-smooth"
                onClick={() => onRequestClick(request?.id)}
              >
                <span className="text-xs md:text-sm font-caption font-medium text-foreground data-text">
                  {request?.requestNumber || `#${request?.id?.substring(0, 8)}`}
                </span>
              </td>
              <td 
                className="p-3 md:p-4 cursor-pointer"
                onClick={() => onRequestClick(request?.id)}
              >
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-caption font-medium text-foreground line-clamp-1 hover:text-primary transition-smooth">
                    {request?.title}
                  </span>
                  <span className="text-xs font-caption text-muted-foreground line-clamp-1 mt-0.5">
                    {request?.description}
                  </span>
                </div>
              </td>
              <td className="p-3 md:p-4">
                <span className={`inline-flex px-2 py-1 text-xs font-caption font-medium rounded-md border ${getTypeColor(request?.type)}`}>
                  {getTypeLabel(request?.type)}
                </span>
              </td>
              <td className="p-3 md:p-4">
                <div className="flex items-center space-x-1">
                  <Icon
                    name={getPriorityIcon(request?.priority)?.name}
                    size={16}
                    className={getPriorityIcon(request?.priority)?.color}
                  />
                  <span className="text-xs md:text-sm font-caption text-foreground capitalize">
                    {request?.priority}
                  </span>
                </div>
              </td>
              <td className="p-3 md:p-4">
                {request?.assignedUsers && request?.assignedUsers?.length > 0 ? (
                  <div className="flex items-center -space-x-2">
                    {request?.assignedUsers?.slice(0, 3)?.map((user, idx) => {
                      // Obtener iniciales (primera letra del nombre + primera letra del apellido)
                      const nameParts = user?.name?.split(' ') || [];
                      const initials = nameParts.length >= 2
                        ? `${nameParts[0]?.charAt(0)}${nameParts[1]?.charAt(0)}`.toUpperCase()
                        : nameParts[0]?.charAt(0)?.toUpperCase() || '?';

                      return (
                        <div
                          key={user?.id}
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-card bg-primary/10 flex items-center justify-center"
                          title={user?.name}
                        >
                          <span className="text-xs font-medium text-primary">
                            {initials}
                          </span>
                        </div>
                      );
                    })}
                    {request?.assignedUsers?.length > 3 && (
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium text-foreground">
                          +{request?.assignedUsers?.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-xs md:text-sm font-caption text-muted-foreground">Sin asignar</span>
                )}
              </td>
              <td className="p-3 md:p-4">
                <span className="text-xs md:text-sm font-caption text-foreground data-text">
                  {formatHoursCompact(request?.estimatedHours)}
                </span>
              </td>
              <td className="p-3 md:p-4">
                <span className={`inline-flex px-2 py-1 text-xs font-caption font-medium rounded-md ${getStatusColor(request?.status)}`}>
                  {getStatusLabel(request?.status)}
                </span>
              </td>
              <td className="p-3 md:p-4">
                <span className="text-xs md:text-sm font-caption text-foreground">
                  {request?.client?.name || request?.clientName || '-'}
                </span>
              </td>
              <td className="p-3 md:p-4">
                <span className="text-xs md:text-sm font-caption text-muted-foreground">
                  {formatDate(request?.updatedAt || request?.createdAt)}
                </span>
              </td>
              <td className="p-3 md:p-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestClick(request?.id);
                    }}
                    className="p-2 rounded hover:bg-muted transition-smooth"
                    title="Ver detalle"
                  >
                    <Icon name="Eye" size={16} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onEditRequest) {
                        onEditRequest(request?.id);
                      }
                    }}
                    className="p-2 rounded hover:bg-muted transition-smooth"
                    title="Editar"
                  >
                    <Icon name="Edit" size={16} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteRequest) {
                        onDeleteRequest(request?.id);
                      }
                    }}
                    className="p-2 rounded hover:bg-error/10 transition-smooth"
                    title="Eliminar"
                  >
                    <Icon name="Trash2" size={16} className="text-error" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;