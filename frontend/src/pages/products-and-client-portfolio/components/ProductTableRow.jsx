import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductTableRow = ({ product, onViewDetails, onToggleStatus }) => {
  const handleStatusToggle = async () => {
    const newStatus = product?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await onToggleStatus(product?.id, newStatus);
  };

  const getTypeIcon = (type) => {
    return type === 'PRODUCT' ? 'Package' : 'Briefcase';
  };

  const getTypeLabel = (type) => {
    return type === 'PRODUCT' ? 'Producto' : 'Servicio';
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      {/* Nombre */}
      <td className="px-3 py-3 md:px-4 md:py-4">
        <div className="flex items-center space-x-2">
          <Icon name={getTypeIcon(product?.type)} size={16} className="text-primary" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {product?.name}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-xs">
              {product?.description}
            </p>
          </div>
        </div>
      </td>

      {/* Tipo */}
      <td className="px-3 py-3 md:px-4 md:py-4">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
          {getTypeLabel(product?.type)}
        </span>
      </td>

      {/* Precio con IVA */}
      <td className="px-3 py-3 md:px-4 md:py-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {formatCurrency(product?.price || 0, product?.currency)}
          </span>
          {product?.hasVAT && (
            <span className="text-xs text-muted-foreground">
              + IVA {product?.vatRate}%
            </span>
          )}
        </div>
      </td>

      {/* Estado (Switch) */}
      <td className="px-3 py-3 md:px-4 md:py-4">
        <button
          onClick={handleStatusToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            product?.status === 'ACTIVE' ? 'bg-success' : 'bg-muted'
          }`}
          title={product?.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              product?.status === 'ACTIVE' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </td>

      {/* Acciones */}
      <td className="px-3 py-3 md:px-4 md:py-4">
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            iconName="Edit"
            onClick={() => onViewDetails(product)}
            title="Editar producto"
          />
        </div>
      </td>
    </>
  );
};

export default ProductTableRow;
