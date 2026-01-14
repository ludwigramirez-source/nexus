import React from 'react';
import Icon from '../../../components/AppIcon';

const ClientsByProductTable = ({ selectedProduct, clients }) => {
  if (!selectedProduct) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Target" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-sm">
          Selecciona un producto de la izquierda para ver sus clientes
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: selectedProduct.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getHealthScoreBadge = (score) => {
    if (score >= 80) {
      return { color: 'text-success bg-success/10', label: 'Excelente' };
    } else if (score >= 60) {
      return { color: 'text-info bg-info/10', label: 'Bueno' };
    } else if (score >= 40) {
      return { color: 'text-warning bg-warning/10', label: 'Regular' };
    } else {
      return { color: 'text-error bg-error/10', label: 'En Riesgo' };
    }
  };

  const getTierBadge = (tier) => {
    const badges = {
      ENTERPRISE: { color: 'text-purple-600 bg-purple-100', label: 'Enterprise' },
      PRO: { color: 'text-blue-600 bg-blue-100', label: 'Professional' },
      BASIC: { color: 'text-gray-600 bg-gray-100', label: 'Básico' },
    };
    return badges[tier] || badges.BASIC;
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-5 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2">
              {selectedProduct.name}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedProduct.description}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">MRR Total</p>
                <p className="text-base md:text-lg font-heading font-bold text-foreground">
                  {formatCurrency(selectedProduct.mrr)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Clientes</p>
                <p className="text-base md:text-lg font-heading font-bold text-foreground">
                  {clients?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Precio</p>
                <p className="text-base md:text-lg font-heading font-bold text-foreground">
                  {formatCurrency(selectedProduct.price)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tipo</p>
                <p className="text-base md:text-lg font-heading font-bold text-foreground">
                  {selectedProduct.type === 'PRODUCT' ? 'Producto' : 'Servicio'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-base font-heading font-semibold text-foreground">
            Clientes ({clients?.length || 0})
          </h3>
        </div>

        {!clients || clients.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm">
              No hay clientes asociados a este producto
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                    <span className="text-xs md:text-sm font-caption font-semibold text-foreground uppercase tracking-wider">
                      Cliente
                    </span>
                  </th>
                  <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                    <span className="text-xs md:text-sm font-caption font-semibold text-foreground uppercase tracking-wider">
                      Salud
                    </span>
                  </th>
                  <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                    <span className="text-xs md:text-sm font-caption font-semibold text-foreground uppercase tracking-wider">
                      Nivel
                    </span>
                  </th>
                  <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                    <span className="text-xs md:text-sm font-caption font-semibold text-foreground uppercase tracking-wider">
                      MRR
                    </span>
                  </th>
                  <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                    <span className="text-xs md:text-sm font-caption font-semibold text-foreground uppercase tracking-wider">
                      Custom.
                    </span>
                  </th>
                  <th className="px-3 py-3 md:px-4 md:py-4 text-left">
                    <span className="text-xs md:text-sm font-caption font-semibold text-foreground uppercase tracking-wider">
                      Última Act.
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clients.map((client) => {
                  const healthBadge = getHealthScoreBadge(client.healthScore);
                  const tierBadge = getTierBadge(client.tier);

                  return (
                    <tr key={client.id} className="hover:bg-muted/30 transition-smooth">
                      <td className="px-3 py-3 md:px-4 md:py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Icon name="Building2" size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{client.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 md:px-4 md:py-4">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-foreground mr-2">
                            {client.healthScore}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${healthBadge.color}`}>
                            {healthBadge.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 md:px-4 md:py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tierBadge.color}`}>
                          {tierBadge.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 md:px-4 md:py-4">
                        <span className="text-sm font-medium text-foreground">
                          {formatCurrency(client.mrr)}
                        </span>
                      </td>
                      <td className="px-3 py-3 md:px-4 md:py-4">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                          {client.customizations}
                        </span>
                      </td>
                      <td className="px-3 py-3 md:px-4 md:py-4">
                        <span className="text-xs text-muted-foreground">
                          {new Date(client.updatedAt).toLocaleDateString('es-ES')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer with total */}
        {clients && clients.length > 0 && (
          <div className="px-4 py-3 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Total facturación de este producto:
              </span>
              <span className="text-base md:text-lg font-heading font-bold text-foreground">
                {formatCurrency(selectedProduct.mrr)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsByProductTable;
