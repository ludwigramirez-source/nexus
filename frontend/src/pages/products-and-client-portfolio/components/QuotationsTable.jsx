import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuotationsTable = ({
  quotations,
  onView,
  onSendEmail,
  onDelete,
  onDuplicate,
  onDownloadPDF,
  onUpdateStatus
}) => {
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // Get status badge classes
  const getStatusBadge = (status) => {
    const badges = {
      DRAFT: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Borrador' },
      SENT: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Enviada' },
      ACCEPTED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aceptada' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rechazada' },
      EXPIRED: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Vencida' },
      CONVERTED_TO_ORDER: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Convertida' }
    };
    return badges[status] || badges.DRAFT;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return `${currency} $${parseFloat(amount).toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Check if quotation is expired
  const isExpired = (quotation) => {
    if (!quotation.validUntil) return false;
    const validUntil = new Date(quotation.validUntil);
    const now = new Date();
    return validUntil < now && quotation.status === 'SENT';
  };

  // Handle action menu toggle
  const toggleActionMenu = (quotationId) => {
    setActionMenuOpen(actionMenuOpen === quotationId ? null : quotationId);
  };

  // Status change options based on current status
  const getStatusChangeOptions = (currentStatus) => {
    const options = {
      DRAFT: [
        { value: 'SENT', label: 'Marcar como Enviada', icon: 'Send' },
        { value: 'REJECTED', label: 'Marcar como Rechazada', icon: 'XCircle' }
      ],
      SENT: [
        { value: 'ACCEPTED', label: 'Marcar como Aceptada', icon: 'CheckCircle' },
        { value: 'REJECTED', label: 'Marcar como Rechazada', icon: 'XCircle' },
        { value: 'EXPIRED', label: 'Marcar como Vencida', icon: 'Clock' }
      ],
      ACCEPTED: [
        { value: 'CONVERTED_TO_ORDER', label: 'Convertir en Venta', icon: 'ShoppingCart' }
      ],
      EXPIRED: [
        { value: 'SENT', label: 'Reenviar', icon: 'Send' }
      ],
      REJECTED: [],
      CONVERTED_TO_ORDER: []
    };
    return options[currentStatus] || [];
  };

  if (!quotations || quotations.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-12 text-center">
        <Icon name="FileText" size={64} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          No hay cotizaciones
        </h3>
        <p className="text-sm font-caption text-muted-foreground">
          Crea tu primera cotización haciendo clic en el botón "Nueva Cotización"
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Número
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Validez
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {quotations.map((quotation) => {
              const statusBadge = getStatusBadge(quotation.status);
              const expired = isExpired(quotation);
              const statusOptions = getStatusChangeOptions(quotation.status);

              return (
                <tr
                  key={quotation.id}
                  className="hover:bg-muted/30 transition-smooth"
                >
                  {/* Quotation Number */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-caption font-semibold text-primary">
                      {quotation.quotationNumber}
                    </span>
                  </td>

                  {/* Client */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon name="Building2" size={16} className="text-primary" />
                      </div>
                      <span className="text-sm font-caption text-foreground">
                        {quotation.clientName}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-caption text-muted-foreground">
                      {formatDate(quotation.createdAt)}
                    </span>
                  </td>

                  {/* Valid Until */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-caption ${expired ? 'text-error font-semibold' : 'text-muted-foreground'}`}>
                        {formatDate(quotation.validUntil)}
                      </span>
                      {expired && (
                        <Icon name="AlertCircle" size={14} className="text-error" />
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                      {statusBadge.label}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-caption font-semibold text-foreground">
                      {formatCurrency(quotation.totalAmount, quotation.currency)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        iconName="Eye"
                        onClick={() => onView(quotation)}
                        title="Ver detalles"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        iconName="Send"
                        onClick={() => onSendEmail(quotation)}
                        title="Enviar por correo"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        iconName="Copy"
                        onClick={() => onDuplicate(quotation.id)}
                        title="Duplicar"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        iconName="Download"
                        onClick={() => onDownloadPDF(quotation.id)}
                        title="Descargar PDF"
                      />

                      {/* Status Change Dropdown */}
                      {statusOptions.length > 0 && (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            iconName="MoreVertical"
                            onClick={() => toggleActionMenu(quotation.id)}
                            title="Más acciones"
                          />
                          {actionMenuOpen === quotation.id && (
                            <>
                              {/* Backdrop */}
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActionMenuOpen(null)}
                              />
                              {/* Menu */}
                              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-elevation-3 z-20 py-1">
                                {statusOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() => {
                                      onUpdateStatus(quotation.id, option.value);
                                      setActionMenuOpen(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm font-caption text-foreground hover:bg-muted/30 transition-smooth flex items-center gap-2"
                                  >
                                    <Icon name={option.icon} size={16} />
                                    {option.label}
                                  </button>
                                ))}
                                <div className="h-px bg-border my-1"></div>
                                <button
                                  onClick={() => {
                                    onDelete(quotation.id);
                                    setActionMenuOpen(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm font-caption text-error hover:bg-error/10 transition-smooth flex items-center gap-2"
                                >
                                  <Icon name="Trash2" size={16} />
                                  Eliminar
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Delete button if no status options */}
                      {statusOptions.length === 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          iconName="Trash2"
                          onClick={() => onDelete(quotation.id)}
                          title="Eliminar"
                          className="text-error hover:text-error hover:bg-error/10"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotationsTable;
