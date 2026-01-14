import React, { useState, useEffect, useMemo } from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import QuotationItemRow from './QuotationItemRow';
import { systemConfigService } from '../../../services/systemConfigService';

const QuotationModal = ({
  isOpen,
  onClose,
  onSave,
  quotation = null,
  clients,
  products,
  onCreateClient
}) => {
  const isEditing = !!quotation;

  // Form state
  const [formData, setFormData] = useState({
    clientId: '',
    validUntil: '',
    currency: 'USD',
    deliveryTime: '',
    paymentTerms: '',
    warranty: '',
    observations: '',
    internalNotes: '',
    items: []
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [commercialTermsTemplates, setCommercialTermsTemplates] = useState([]);
  const [observationsTemplates, setObservationsTemplates] = useState([]);

  // Load templates from company config
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await systemConfigService.getCompanyConfig();
        const companyConfig = response?.data || {};
        setCommercialTermsTemplates(companyConfig.commercialTermsTemplates || []);
        setObservationsTemplates(companyConfig.observationsTemplates || []);
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    };
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  // Initialize form with quotation data when editing
  useEffect(() => {
    if (isOpen) {
      if (quotation) {
        setFormData({
          clientId: quotation.clientId || '',
          validUntil: quotation.validUntil ? quotation.validUntil.split('T')[0] : '',
          currency: quotation.currency || 'USD',
          deliveryTime: quotation.deliveryTime || '',
          paymentTerms: quotation.paymentTerms || '',
          warranty: quotation.warranty || '',
          observations: quotation.observations || '',
          internalNotes: quotation.internalNotes || '',
          items: quotation.quotationItems?.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            recurrence: item.recurrence || undefined,
            deliveryTime: item.deliveryTime || '',
            description: item.description || ''
          })) || []
        });
      } else {
        // Reset form for new quotation
        setFormData({
          clientId: '',
          validUntil: '',
          currency: 'USD',
          deliveryTime: '',
          paymentTerms: '',
          warranty: '',
          observations: '',
          internalNotes: '',
          items: []
        });
      }
      setErrors({});
    }
  }, [isOpen, quotation]);

  // Client options
  const clientOptions = useMemo(() => {
    return clients?.map((client) => ({
      value: client?.id,
      label: client?.name
    })) || [];
  }, [clients]);

  // Currency options
  const currencyOptions = [
    { value: 'USD', label: 'USD - Dólar' },
    { value: 'COP', label: 'COP - Peso Colombiano' },
    { value: 'EUR', label: 'EUR - Euro' }
  ];

  // Calculate totals
  const totals = useMemo(() => {
    let subtotal = 0;
    let taxAmount = 0;
    let discountAmount = 0;

    formData.items.forEach((item) => {
      const product = products?.find((p) => p?.id === item?.productId);
      if (!product) return;

      const itemSubtotal = item.quantity * item.unitPrice;
      const itemDiscountAmount = itemSubtotal * (item.discount / 100);
      const itemSubtotalAfterDiscount = itemSubtotal - itemDiscountAmount;

      const hasVAT = product.hasVAT || false;
      const vatRate = parseFloat(product.vatRate) || 0;
      const itemTaxAmount = hasVAT ? itemSubtotalAfterDiscount * (vatRate / 100) : 0;

      subtotal += itemSubtotalAfterDiscount;
      taxAmount += itemTaxAmount;
      discountAmount += itemDiscountAmount;
    });

    return {
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      totalAmount: (subtotal + taxAmount).toFixed(2)
    };
  }, [formData.items, products]);

  // Add item
  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          productId: '',
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          recurrence: undefined,
          deliveryTime: '',
          description: ''
        }
      ]
    });
  };

  // Update item
  const handleItemChange = (index, updatedItem) => {
    const newItems = [...formData.items];
    newItems[index] = updatedItem;
    setFormData({ ...formData, items: newItems });
  };

  // Remove item
  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.clientId) {
      newErrors.clientId = 'El cliente es requerido';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'Debe agregar al menos un item';
    } else {
      formData.items.forEach((item, index) => {
        if (!item.productId) {
          newErrors[`item_${index}_product`] = 'El producto es requerido';
        }
        if (!item.quantity || item.quantity <= 0) {
          newErrors[`item_${index}_quantity`] = 'La cantidad debe ser mayor a 0';
        }
        if (item.unitPrice < 0) {
          newErrors[`item_${index}_price`] = 'El precio no puede ser negativo';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving quotation:', error);
      setErrors({ submit: 'Error al guardar la cotización. Por favor intente nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg border border-border shadow-elevation-4 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
            {isEditing ? 'Editar Cotización' : 'Nueva Cotización'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
            className="h-8 w-8"
          />
        </div>

        <div className="p-4 md:p-6 space-y-6">
        {/* Header - Status Badge */}
        {isEditing && quotation && (
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <span className="text-sm font-caption text-muted-foreground">Número:</span>
              <span className="ml-2 font-semibold text-foreground">{quotation.quotationNumber}</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              quotation.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
              quotation.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
              quotation.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
              quotation.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
              quotation.status === 'EXPIRED' ? 'bg-orange-100 text-orange-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {quotation.status}
            </div>
          </div>
        )}

        {/* Error message */}
        {errors.submit && (
          <div className="p-3 bg-error/10 border border-error rounded-lg text-error text-sm">
            {errors.submit}
          </div>
        )}

        {/* Section 1: Client */}
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
            Cliente
          </h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <Select
                label="Cliente"
                options={clientOptions}
                value={formData.clientId}
                onChange={(val) => setFormData({ ...formData, clientId: val })}
                placeholder="Seleccionar cliente"
                error={errors.clientId}
                required
              />
            </div>
            {onCreateClient && (
              <Button
                variant="outline"
                size="md"
                iconName="Plus"
                iconPosition="left"
                onClick={onCreateClient}
                className="mt-6"
              >
                Crear Cliente
              </Button>
            )}
          </div>
        </div>

        {/* Section 2: General Information */}
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
            Información General
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Válido Hasta"
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
            <Select
              label="Moneda"
              options={currencyOptions}
              value={formData.currency}
              onChange={(val) => setFormData({ ...formData, currency: val })}
            />
            <Input
              label="Tiempo de Entrega General"
              type="text"
              value={formData.deliveryTime}
              onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
              placeholder="Ej: 30 días hábiles"
            />
            <Input
              label="Garantía"
              type="text"
              value={formData.warranty}
              onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
              placeholder="Ej: 12 meses"
            />
          </div>
        </div>

        {/* Section 3: Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Items de la Cotización
            </h3>
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={handleAddItem}
            >
              Agregar Item
            </Button>
          </div>

          {errors.items && (
            <div className="p-3 bg-error/10 border border-error rounded-lg text-error text-sm mb-3">
              {errors.items}
            </div>
          )}

          {formData.items.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-border rounded-lg text-center">
              <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-caption text-muted-foreground">
                No hay items agregados. Haga clic en "Agregar Item" para comenzar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <QuotationItemRow
                  key={index}
                  item={item}
                  products={products}
                  onChange={(updatedItem) => handleItemChange(index, updatedItem)}
                  onRemove={() => handleRemoveItem(index)}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Totals */}
        {formData.items.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
              Totales
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Descuento Total:</span>
                <span className="font-medium text-foreground">
                  {formData.currency} ${totals.discountAmount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium text-foreground">
                  {formData.currency} ${totals.subtotal}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA:</span>
                <span className="font-medium text-foreground">
                  {formData.currency} ${totals.taxAmount}
                </span>
              </div>
              <div className="h-px bg-border my-2"></div>
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total:</span>
                <span className="font-bold text-lg text-primary">
                  {formData.currency} ${totals.totalAmount}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Terms and Observations */}
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
            Condiciones Comerciales
          </h3>
          {commercialTermsTemplates.length > 0 && (
            <div className="mb-3">
              <Select
                label="Cargar plantilla"
                value=""
                onChange={(value) => {
                  const template = commercialTermsTemplates.find(t => t.id === value);
                  if (template) {
                    setFormData({ ...formData, paymentTerms: template.content });
                  }
                }}
                options={[
                  { value: '', label: 'Seleccionar plantilla...' },
                  ...commercialTermsTemplates.map(template => ({
                    value: template.id,
                    label: template.name + (template.isDefault ? ' (Por defecto)' : '')
                  }))
                ]}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Términos de Pago
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none"
              rows={4}
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              placeholder="Especifique las condiciones de pago..."
            />
          </div>
        </div>

        <div>
          {observationsTemplates.length > 0 && (
            <div className="mb-3">
              <Select
                label="Cargar plantilla"
                value=""
                onChange={(value) => {
                  const template = observationsTemplates.find(t => t.id === value);
                  if (template) {
                    setFormData({ ...formData, observations: template.content });
                  }
                }}
                options={[
                  { value: '', label: 'Seleccionar plantilla...' },
                  ...observationsTemplates.map(template => ({
                    value: template.id,
                    label: template.name + (template.isDefault ? ' (Por defecto)' : '')
                  }))
                ]}
              />
            </div>
          )}
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Observaciones
          </label>
          <textarea
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none"
            rows={3}
            value={formData.observations}
            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            placeholder="Observaciones visibles para el cliente..."
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Notas Internas
          </label>
          <textarea
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none"
            rows={3}
            value={formData.internalNotes}
            onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
            placeholder="Notas internas (no visibles en el PDF)..."
          />
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={loading || formData.items.length === 0}
            iconName={loading ? 'Loader2' : 'Save'}
            iconPosition="left"
            className={loading ? 'animate-spin' : ''}
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar Cotización' : 'Crear Cotización'}
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationModal;
