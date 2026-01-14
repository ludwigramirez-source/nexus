import React from 'react';
import Icon from '../../../components/AppIcon';

const ProductCard = ({ product, isSelected, onClick }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: product.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      onClick={() => onClick(product)}
      className={`bg-card border rounded-lg p-4 cursor-pointer transition-smooth hover:shadow-elevation-2 ${
        isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-sm md:text-base font-heading font-semibold text-foreground mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>
        {product.growth > 0 && (
          <div className="flex items-center text-xs font-medium text-success ml-2">
            <Icon name="TrendingUp" size={14} />
            <span className="ml-1">{product.growth}%</span>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* MRR */}
        <div>
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <Icon name="DollarSign" size={12} className="mr-1" />
            <span>MRR</span>
          </div>
          <p className="text-sm md:text-base font-heading font-bold text-foreground">
            {formatCurrency(product.mrr)}
          </p>
        </div>

        {/* Clients */}
        <div>
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <Icon name="Users" size={12} className="mr-1" />
            <span>Clientes</span>
          </div>
          <p className="text-sm md:text-base font-heading font-bold text-foreground">
            {product.clientCount}
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center text-xs text-muted-foreground">
          <Icon name="Code" size={12} className="mr-1" />
          <span>Personalizaciones</span>
          <span className="ml-1 font-medium text-foreground">{product.customizations}</span>
        </div>

        {product.debt > 0 && (
          <div className="flex items-center text-xs text-error">
            <Icon name="AlertTriangle" size={12} className="mr-1" />
            <span>Deuda</span>
            <span className="ml-1 font-medium">{product.debt}%</span>
          </div>
        )}
      </div>

      {/* View Clients Button */}
      <button
        className="w-full mt-3 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-xs font-medium text-foreground transition-smooth flex items-center justify-center"
      >
        <Icon name="Users" size={14} className="mr-1" />
        Ver Clientes
      </button>
    </div>
  );
};

const ProductCardList = ({ products, selectedProductId, onProductSelect }) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Productos
        </h2>
        <button className="text-sm text-primary hover:text-primary/80 transition-smooth flex items-center">
          <Icon name="Plus" size={16} className="mr-1" />
          Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={selectedProductId === product.id}
            onClick={onProductSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCardList;
