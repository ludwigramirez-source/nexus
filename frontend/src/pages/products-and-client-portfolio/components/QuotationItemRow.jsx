import React, { useMemo } from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuotationItemRow = ({ item, products, onChange, onRemove, index }) => {
  // Get product details
  const selectedProduct = useMemo(() => {
    return products?.find((p) => p?.id === item?.productId);
  }, [products, item?.productId]);

  // Calculate item total
  const calculateTotal = useMemo(() => {
    const quantity = parseFloat(item?.quantity) || 0;
    const unitPrice = parseFloat(item?.unitPrice) || 0;
    const discount = parseFloat(item?.discount) || 0;

    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (discount / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;

    // Get VAT from product
    const hasVAT = selectedProduct?.hasVAT || false;
    const vatRate = parseFloat(selectedProduct?.vatRate) || 0;
    const taxAmount = hasVAT ? subtotalAfterDiscount * (vatRate / 100) : 0;

    const total = subtotalAfterDiscount + taxAmount;

    return {
      subtotal: subtotalAfterDiscount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2)
    };
  }, [item?.quantity, item?.unitPrice, item?.discount, selectedProduct]);

  // Product options for select
  const productOptions = useMemo(() => {
    return products?.map((product) => ({
      value: product?.id,
      label: `${product?.name} ${product?.type === 'SERVICE' ? '(Servicio)' : '(Producto)'}`
    })) || [];
  }, [products]);

  // Recurrence options
  const recurrenceOptions = [
    { value: '', label: 'Pago único' },
    { value: 'MONTHLY', label: 'Mensual' },
    { value: 'QUARTERLY', label: 'Trimestral' },
    { value: 'SEMIANNUAL', label: 'Semestral' },
    { value: 'ANNUAL', label: 'Anual' }
  ];

  // Handle product change - auto-fill price
  const handleProductChange = (productId) => {
    const product = products?.find((p) => p?.id === productId);
    onChange({
      ...item,
      productId,
      unitPrice: product?.price || item?.unitPrice || 0,
      description: product?.description || item?.description || ''
    });
  };

  return (
    <div className="grid grid-cols-12 gap-3 mb-3 p-4 border border-border rounded-lg bg-muted/20">
      {/* Item Number */}
      <div className="col-span-12 flex items-center justify-between mb-2">
        <span className="text-sm font-caption font-semibold text-foreground">
          Item #{index + 1}
        </span>
        <Button
          variant="ghost"
          size="icon"
          iconName="Trash2"
          onClick={onRemove}
          className="text-error hover:text-error hover:bg-error/10"
          title="Eliminar item"
        />
      </div>

      {/* Product */}
      <div className="col-span-12 md:col-span-4">
        <Select
          label="Producto/Servicio"
          options={productOptions}
          value={item?.productId || ''}
          onChange={handleProductChange}
          placeholder="Seleccionar producto"
          required
        />
      </div>

      {/* Quantity */}
      <div className="col-span-6 md:col-span-2">
        <Input
          label="Cantidad"
          type="number"
          min="0"
          step="0.01"
          value={item?.quantity || ''}
          onChange={(e) => onChange({ ...item, quantity: parseFloat(e.target.value) || 0 })}
          placeholder="0"
          required
        />
      </div>

      {/* Unit Price */}
      <div className="col-span-6 md:col-span-2">
        <Input
          label="Precio Unitario"
          type="number"
          min="0"
          step="0.01"
          value={item?.unitPrice || ''}
          onChange={(e) => onChange({ ...item, unitPrice: parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
          prefix="$"
          required
        />
      </div>

      {/* Discount */}
      <div className="col-span-6 md:col-span-2">
        <Input
          label="Descuento"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={item?.discount || 0}
          onChange={(e) => onChange({ ...item, discount: parseFloat(e.target.value) || 0 })}
          placeholder="0"
          suffix="%"
        />
      </div>

      {/* Total (read-only) */}
      <div className="col-span-6 md:col-span-2">
        <Input
          label="Total"
          type="text"
          value={calculateTotal.total}
          readOnly
          prefix="$"
          className="font-bold"
        />
      </div>

      {/* Recurrence (only for services) */}
      {selectedProduct?.type === 'SERVICE' && (
        <div className="col-span-12 md:col-span-4">
          <Select
            label="Recurrencia"
            options={recurrenceOptions}
            value={item?.recurrence || ''}
            onChange={(val) => onChange({ ...item, recurrence: val || undefined })}
            placeholder="Seleccionar recurrencia"
          />
        </div>
      )}

      {/* Delivery Time */}
      <div className="col-span-12 md:col-span-4">
        <Input
          label="Tiempo de Entrega"
          type="text"
          value={item?.deliveryTime || ''}
          onChange={(e) => onChange({ ...item, deliveryTime: e.target.value })}
          placeholder="Ej: 15 días hábiles"
        />
      </div>

      {/* Description */}
      <div className="col-span-12">
        <Input
          label="Descripción Adicional (Opcional)"
          type="text"
          value={item?.description || ''}
          onChange={(e) => onChange({ ...item, description: e.target.value })}
          placeholder="Detalles adicionales del producto/servicio"
        />
      </div>

      {/* Totals Breakdown */}
      <div className="col-span-12 bg-card border border-border rounded-lg p-3">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="ml-2 font-medium text-foreground">${calculateTotal.subtotal}</span>
          </div>
          <div>
            <span className="text-muted-foreground">IVA:</span>
            <span className="ml-2 font-medium text-foreground">${calculateTotal.taxAmount}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total:</span>
            <span className="ml-2 font-bold text-foreground">${calculateTotal.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationItemRow;
