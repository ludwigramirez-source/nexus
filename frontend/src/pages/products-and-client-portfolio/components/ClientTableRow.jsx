import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const ClientTableRow = ({ client, onTierChange, onViewDetails, onEditClient, onToggleStatus, onDelete, isSelected, onSelectChange }) => {

  const getTierLabel = (tier) => {
    const labels = {
      ENTERPRISE: 'Enterprise',
      PRO: 'Professional',
      BASIC: 'Básico',
      enterprise: 'Enterprise',
      professional: 'Professional',
      basic: 'Básico'
    };
    return labels?.[tier] || tier;
  };

  const getTierBadgeColor = (tier) => {
    const colors = {
      ENTERPRISE: 'bg-primary/10 text-primary',
      PRO: 'bg-accent/10 text-accent',
      BASIC: 'bg-muted text-muted-foreground',
      enterprise: 'bg-primary/10 text-primary',
      professional: 'bg-accent/10 text-accent',
      basic: 'bg-muted text-muted-foreground'
    };
    return colors?.[tier] || colors?.basic;
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-error';
  };

  const getHealthLabel = (score) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bueno';
    if (score >= 40) return 'Regular';
    return 'En Riesgo';
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const handleTierChange = (newTier) => {
    onTierChange(client?.id, newTier);
  };

  const handleStatusToggle = async () => {
    const newStatus = client?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await onToggleStatus(client?.id, newStatus);
  };

  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-smooth">
      {/* Checkbox */}
      <td className="px-3 py-3 md:px-4 md:py-4">
        <Checkbox
          checked={isSelected}
          onChange={(e) => onSelectChange(client?.id, e?.target?.checked)}
        />
      </td>

      {/* Nombre y Producto */}
      <td className="px-3 py-3 md:px-4 md:py-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Building2" size={20} className="text-primary" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm md:text-base font-caption font-medium text-foreground truncate">
              {client?.name}
            </p>
            <p className="text-xs font-caption text-muted-foreground truncate">
              {client?.contactPerson || 'Sin contacto'}
            </p>
          </div>
        </div>
      </td>

      {/* Health Score */}
      <td className="px-3 py-3 md:px-4 md:py-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-muted rounded-full h-2 max-w-[80px]">
            <div
              className={`h-2 rounded-full transition-all ${getHealthColor(client?.healthScore)}`}
              style={{ width: `${client?.healthScore}%` }}
            />
          </div>
          <span className="text-xs md:text-sm font-caption font-medium text-foreground whitespace-nowrap">
            {client?.healthScore}
          </span>
        </div>
        <p className="text-xs font-caption text-muted-foreground mt-1">
          {getHealthLabel(client?.healthScore)}
        </p>
      </td>

      {/* Tier */}
      <td className="px-3 py-3 md:px-4 md:py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-caption font-medium ${getTierBadgeColor(client?.tier)}`}>
          {getTierLabel(client?.tier)}
        </span>
      </td>

      {/* MRR */}
      <td className="px-3 py-3 md:px-4 md:py-4">
        <p className="text-sm md:text-base font-caption font-medium text-foreground whitespace-nowrap">
          {formatCurrency(client?.mrr)}
        </p>
      </td>

      {/* Estado (Toggle Switch) */}
      <td className="px-3 py-3 md:px-4 md:py-4">
        <button
          onClick={handleStatusToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            client?.status === 'ACTIVE' ? 'bg-success' : 'bg-muted'
          }`}
          title={client?.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              client?.status === 'ACTIVE' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </td>

      {/* Acciones */}
      <td className="px-3 py-3 md:px-4 md:py-4">
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            iconName="Eye"
            onClick={() => onViewDetails(client)}
            title="Ver detalles"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Edit"
            onClick={() => onEditClient(client)}
            title="Editar cliente"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={() => onDelete(client?.id)}
            title="Eliminar cliente"
            className="text-error hover:text-error hover:bg-error/10"
          />
        </div>
      </td>
    </tr>
  );
};

export default ClientTableRow;