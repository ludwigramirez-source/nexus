import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RequestTable = ({ requests, onRequestSelect, selectedRequests, onBulkAction, onInlineEdit, onRequestClick }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [editingCell, setEditingCell] = useState(null);

  const getTypeColor = (type) => {
    const colors = {
      product_feature: 'bg-success/10 text-success border-success/20',
      customization: 'bg-accent/10 text-accent border-accent/20',
      bug: 'bg-error/10 text-error border-error/20',
      support: 'bg-primary/10 text-primary border-primary/20',
      infrastructure: 'bg-secondary/10 text-secondary border-secondary/20'
    };
    return colors?.[type] || colors?.support;
  };

  const getTypeLabel = (type) => {
    const labels = {
      product_feature: 'Producto',
      customization: 'Personalización',
      bug: 'Error',
      support: 'Soporte',
      infrastructure: 'Infraestructura'
    };
    return labels?.[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-muted text-muted-foreground',
      in_progress: 'bg-primary/10 text-primary',
      review: 'bg-accent/10 text-accent',
      completed: 'bg-success/10 text-success'
    };
    return colors?.[status] || colors?.pending;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendiente',
      in_progress: 'En Progreso',
      review: 'En Revisión',
      completed: 'Completado'
    };
    return labels?.[status] || status;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      critical: { name: 'AlertCircle', color: 'text-error' },
      high: { name: 'ArrowUp', color: 'text-warning' },
      medium: { name: 'Minus', color: 'text-accent' },
      low: { name: 'ArrowDown', color: 'text-muted-foreground' }
    };
    return icons?.[priority] || icons?.medium;
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
                onClick={() => handleSort('id')}
                className="flex items-center space-x-1 text-xs md:text-sm font-caption font-medium text-foreground hover:text-primary transition-smooth"
              >
                <span>ID</span>
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
              <span className="text-xs md:text-sm font-caption font-medium text-foreground">Horas Real</span>
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
                  #{request?.id}
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
                {request?.assignee ? (
                  <div className="flex items-center space-x-2">
                    <Image
                      src={request?.assignee?.avatar}
                      alt={request?.assignee?.avatarAlt}
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                    />
                    <span className="text-xs md:text-sm font-caption text-foreground hidden lg:inline">
                      {request?.assignee?.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs md:text-sm font-caption text-muted-foreground">Sin asignar</span>
                )}
              </td>
              <td className="p-3 md:p-4">
                <span className="text-xs md:text-sm font-caption text-foreground data-text">
                  {request?.estimatedHours}h
                </span>
              </td>
              <td className="p-3 md:p-4">
                {editingCell === `${request?.id}-actualHours` ? (
                  <input
                    type="number"
                    defaultValue={request?.actualHours}
                    onBlur={(e) => handleInlineEdit(request?.id, 'actualHours', e?.target?.value)}
                    onKeyDown={(e) => {
                      if (e?.key === 'Enter') {
                        handleInlineEdit(request?.id, 'actualHours', e?.target?.value);
                      }
                    }}
                    className="w-16 px-2 py-1 text-xs md:text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setEditingCell(`${request?.id}-actualHours`)}
                    className="text-xs md:text-sm font-caption text-foreground data-text hover:text-primary transition-smooth"
                  >
                    {request?.actualHours}h
                  </button>
                )}
              </td>
              <td className="p-3 md:p-4">
                <span className={`inline-flex px-2 py-1 text-xs font-caption font-medium rounded-md ${getStatusColor(request?.status)}`}>
                  {getStatusLabel(request?.status)}
                </span>
              </td>
              <td className="p-3 md:p-4">
                <span className="text-xs md:text-sm font-caption text-foreground">
                  {request?.client}
                </span>
              </td>
              <td className="p-3 md:p-4">
                <span className="text-xs md:text-sm font-caption text-muted-foreground">
                  {formatDate(request?.lastUpdate)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;