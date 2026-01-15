import React from 'react';
import Icon from '../../../components/AppIcon';

const KanbanCard = ({ quotation, onClick, onEmail, onDownloadPDF }) => {
  // Calculate days since sent
  const daysSinceSent = quotation.sentAt
    ? Math.floor((new Date() - new Date(quotation.sentAt)) / (1000 * 60 * 60 * 24))
    : 0;

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get urgency badge
  const getUrgencyBadge = () => {
    if (!quotation.sentAt) return null;

    const validUntil = quotation.validUntil ? new Date(quotation.validUntil) : null;
    const today = new Date();
    const daysUntilExpiry = validUntil
      ? Math.floor((validUntil - today) / (1000 * 60 * 60 * 24))
      : null;

    if (daysUntilExpiry !== null && daysUntilExpiry <= 3) {
      return (
        <div className="flex items-center gap-1 text-xs text-destructive">
          <Icon name="AlertTriangle" size={14} />
          <span>Vence en {daysUntilExpiry} días</span>
        </div>
      );
    }

    if (daysSinceSent > 7) {
      return (
        <div className="flex items-center gap-1 text-xs text-warning">
          <Icon name="Clock" size={14} />
          <span>{daysSinceSent} días</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Icon name="Clock" size={14} />
        <span>{daysSinceSent} días</span>
      </div>
    );
  };

  return (
    <div
      className="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-shadow cursor-move"
      onClick={onClick}
    >
      {/* Header: Quotation Number + Actions */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon name="FileText" size={16} className="text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            {quotation.quotationNumber}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEmail(quotation);
            }}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Enviar email"
          >
            <Icon name="Mail" size={14} className="text-muted-foreground hover:text-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownloadPDF(quotation.id);
            }}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Descargar PDF"
          >
            <Icon name="Download" size={14} className="text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      </div>

      {/* Client Name */}
      <div className="flex items-center gap-2 mb-2">
        <Icon name="Building2" size={14} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">
          {quotation.clientName || quotation.client?.name}
        </span>
      </div>

      {/* Amount */}
      <div className="text-lg font-bold text-primary mb-2">
        {formatCurrency(quotation.totalAmount, quotation.currency)}
      </div>

      {/* Footer: Date + Urgency */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {formatDate(quotation.sentAt || quotation.createdAt)}
        </span>
        {getUrgencyBadge()}
      </div>
    </div>
  );
};

export default KanbanCard;
