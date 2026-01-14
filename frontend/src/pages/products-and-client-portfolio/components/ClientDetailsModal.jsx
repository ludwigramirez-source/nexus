import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ClientDetailsModal = ({ client, onClose, onEdit }) => {
  if (!client) return null;

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getTierBadgeColor = (tier) => {
    const colors = {
      ENTERPRISE: 'bg-primary/10 text-primary',
      PRO: 'bg-accent/10 text-accent',
      BASIC: 'bg-muted text-muted-foreground',
      enterprise: 'bg-primary/10 text-primary',
      professional: 'bg-accent/10 text-accent',
      standard: 'bg-secondary/10 text-secondary',
      basic: 'bg-muted text-muted-foreground'
    };
    return colors?.[tier] || colors?.basic;
  };

  const getTierLabel = (tier) => {
    const labels = {
      ENTERPRISE: 'Enterprise',
      PRO: 'Professional',
      BASIC: 'Básico'
    };
    return labels?.[tier] || tier;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-lg shadow-elevation-5 w-full max-w-3xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Building2" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-semibold text-foreground">
                {client?.name}
              </h3>
              <p className="text-sm font-caption text-muted-foreground">
                {client?.contactPerson || 'Sin contacto'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
            aria-label="Cerrar modal"
          >
            <Icon name="X" size={24} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-caption text-muted-foreground">Score de Salud</span>
                <Icon name="Heart" size={18} className={getHealthColor(client?.healthScore)} />
              </div>
              <p className={`text-3xl font-heading font-bold ${getHealthColor(client?.healthScore)}`}>
                {client?.healthScore}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-caption text-muted-foreground">Nivel de Cliente</span>
                <Icon name="Award" size={18} className="text-primary" />
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-caption font-medium ${getTierBadgeColor(client?.tier)}`}>
                {getTierLabel(client?.tier)}
              </span>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-caption text-muted-foreground">MRR Mensual</span>
                <Icon name="DollarSign" size={18} className="text-success" />
              </div>
              <p className="text-2xl font-heading font-bold text-foreground">
                {formatCurrency(client?.mrr, client?.currency)}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-caption text-muted-foreground">Estado</span>
                <Icon name="Activity" size={18} className="text-primary" />
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-caption font-medium ${
                client?.status === 'ACTIVE' ? 'bg-success/10 text-success' :
                client?.status === 'CHURNED' ? 'bg-error/10 text-error' :
                'bg-warning/10 text-warning'
              }`}>
                {client?.status === 'ACTIVE' ? 'Activo' :
                 client?.status === 'CHURNED' ? 'Perdido' :
                 'En Riesgo'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-caption font-semibold text-foreground mb-2">
                Información de Contacto
              </h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                {client?.email && (
                  <div className="flex items-center space-x-2">
                    <Icon name="Mail" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-caption text-foreground">
                      {client?.email}
                    </span>
                  </div>
                )}
                {client?.phone && (
                  <div className="flex items-center space-x-2">
                    <Icon name="Phone" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-caption text-foreground">
                      {client?.phone}
                    </span>
                  </div>
                )}
                {client?.website && (
                  <div className="flex items-center space-x-2">
                    <Icon name="Globe" size={16} className="text-muted-foreground" />
                    <a href={client?.website} target="_blank" rel="noopener noreferrer" className="text-sm font-caption text-primary hover:underline">
                      {client?.website}
                    </a>
                  </div>
                )}
                {client?.address && (
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-caption text-foreground">
                      {client?.address}
                    </span>
                  </div>
                )}
                {client?.city && (
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-caption text-foreground">
                      {client?.city}
                    </span>
                  </div>
                )}
                {client?.nit && (
                  <div className="flex items-center space-x-2">
                    <Icon name="FileText" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-caption text-foreground">
                      NIT: {client?.nit}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {client?.updatedAt && (
              <div>
                <h4 className="text-sm font-caption font-semibold text-foreground mb-2">
                  Última Actualización
                </h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-caption text-muted-foreground">
                      Actualizado
                    </span>
                    <span className="text-sm font-caption font-medium text-foreground">
                      {new Date(client?.updatedAt).toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {client?.notes && (
              <div>
                <h4 className="text-sm font-caption font-semibold text-foreground mb-2">
                  Notas
                </h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm font-caption text-foreground">
                    {client?.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            variant="default"
            iconName="Edit"
            iconPosition="left"
            onClick={() => {
              onClose();
              onEdit(client);
            }}
          >
            Editar Cliente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsModal;