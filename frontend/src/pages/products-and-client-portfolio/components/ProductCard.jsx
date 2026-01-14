import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product, onViewRoadmap, onViewClients }) => {
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const getStatusColor = (status) => {
    if (status === 'ACTIVE') return 'text-success';
    if (status === 'DEVELOPMENT') return 'text-warning';
    if (status === 'DEPRECATED') return 'text-error';
    return 'text-muted-foreground';
  };

  const getStatusBadge = (status) => {
    const colors = {
      ACTIVE: 'bg-success/10 text-success',
      DEVELOPMENT: 'bg-warning/10 text-warning',
      DEPRECATED: 'bg-error/10 text-error',
      INACTIVE: 'bg-muted text-muted-foreground'
    };
    const labels = {
      ACTIVE: 'Activo',
      DEVELOPMENT: 'En Desarrollo',
      DEPRECATED: 'Depreciado',
      INACTIVE: 'Inactivo'
    };
    return {
      color: colors[status] || colors.INACTIVE,
      label: labels[status] || status
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
  };

  const statusBadge = getStatusBadge(product?.status);
  const requestsCount = product?._count?.requests || 0;
  const roadmapCount = product?._count?.roadmapItems || 0;

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-5 lg:p-6 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base md:text-lg font-heading font-semibold text-foreground truncate">
              {product?.name}
            </h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
              {statusBadge.label}
            </span>
          </div>
          <p className="text-xs md:text-sm font-caption text-muted-foreground line-clamp-2">
            {product?.description || 'Sin descripción'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Tag" size={16} className="text-primary" />
            <span className="text-xs font-caption text-muted-foreground">Precio</span>
          </div>
          <p className="text-base md:text-lg font-heading font-semibold text-foreground">
            {formatCurrency(product?.price || 0, product?.currency)}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Package" size={16} className="text-primary" />
            <span className="text-xs font-caption text-muted-foreground">Tipo</span>
          </div>
          <p className="text-base md:text-sm font-heading font-semibold text-foreground">
            {product?.type === 'PRODUCT' ? 'Producto' : 'Servicio'}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="FileText" size={16} className="text-accent" />
            <span className="text-xs font-caption text-muted-foreground">Solicitudes</span>
          </div>
          <p className="text-base md:text-lg font-heading font-semibold text-foreground">
            {requestsCount}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Map" size={16} className="text-warning" />
            <span className="text-xs font-caption text-muted-foreground">Roadmap</span>
          </div>
          <p className="text-base md:text-lg font-heading font-semibold text-foreground">
            {roadmapCount} items
          </p>
        </div>
      </div>

      {product?.launchedAt && (
        <div className="mb-4 text-xs text-muted-foreground">
          <Icon name="Calendar" size={14} className="inline mr-1" />
          Lanzado: {formatDate(product.launchedAt)}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          iconName="Map"
          iconPosition="left"
          onClick={() => onViewRoadmap(product?.id)}
          fullWidth
        >
          Ver Roadmap
        </Button>
        {product?.productionUrl && (
          <Button
            variant="secondary"
            size="sm"
            iconName="ExternalLink"
            iconPosition="left"
            onClick={() => window.open(product.productionUrl, '_blank')}
            fullWidth
          >
            Ver Producto
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;