import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ProductCreationModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'PRODUCT',
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    hasVAT: true,
    vatRate: 19,
    recurrence: 'MONTHLY'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: 'PRODUCT',
        name: '',
        description: '',
        price: 0,
        currency: 'USD',
        hasVAT: true,
        vatRate: 19,
        recurrence: 'MONTHLY'
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData?.name?.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData?.description?.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (formData?.price < 0) {
      newErrors.price = 'El precio debe ser mayor o igual a 0';
    }

    if (formData?.hasVAT && (formData?.vatRate < 0 || formData?.vatRate > 100)) {
      newErrors.vatRate = 'El IVA debe estar entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg border border-border shadow-elevation-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
            Crear Nuevo {formData.type === 'PRODUCT' ? 'Producto' : 'Servicio'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
            className="h-8 w-8"
          />
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Tipo de producto/servicio */}
          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-3">
              Tipo <span className="text-error">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="PRODUCT"
                  checked={formData.type === 'PRODUCT'}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
                />
                <span className="ml-2 text-sm text-foreground">Producto</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="SERVICE"
                  checked={formData.type === 'SERVICE'}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
                />
                <span className="ml-2 text-sm text-foreground">Servicio</span>
              </label>
            </div>
          </div>

          <Input
            label="Nombre"
            type="text"
            placeholder="Ej: Mawi Chat, Omnileads, Custom Development"
            value={formData?.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
            error={errors?.name}
            required
          />

          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Descripción <span className="text-error">*</span>
              <span className="text-xs font-normal text-muted-foreground ml-2">
                (Mínimo 10 caracteres)
              </span>
            </label>
            <textarea
              className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none ${
                errors?.description ? 'border-error' : 'border-border'
              }`}
              rows="3"
              placeholder="Describe el producto o servicio..."
              value={formData?.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
            />
            <div className="flex items-center justify-between mt-1">
              <div>
                {errors?.description && (
                  <p className="text-xs text-error">{errors?.description}</p>
                )}
              </div>
              <p className={`text-xs ${
                formData?.description?.length >= 10 ? 'text-success' : 'text-muted-foreground'
              }`}>
                {formData?.description?.length || 0}/10
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Precio"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData?.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e?.target?.value) || 0 }))}
              error={errors?.price}
              required
            />

            <Select
              label="Moneda"
              options={[
                { value: 'USD', label: 'USD - Dólar' },
                { value: 'MXN', label: 'MXN - Peso Mexicano' },
                { value: 'COP', label: 'COP - Peso Colombiano' },
                { value: 'EUR', label: 'EUR - Euro' },
                { value: 'GBP', label: 'GBP - Libra' }
              ]}
              value={formData?.currency}
              onChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
              required
            />
          </div>

          {/* Recurrencia - Solo para servicios */}
          {formData.type === 'SERVICE' && (
            <Select
              label="Recurrencia de Pago"
              options={[
                { value: 'MONTHLY', label: 'Mensual' },
                { value: 'QUARTERLY', label: 'Trimestral' },
                { value: 'SEMIANNUAL', label: 'Semestral' },
                { value: 'ANNUAL', label: 'Anual' },
                { value: 'ONE_TIME', label: 'Pago Único' }
              ]}
              value={formData?.recurrence}
              onChange={(value) => setFormData(prev => ({ ...prev, recurrence: value }))}
              required
            />
          )}

          {/* IVA Section */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasVAT}
                onChange={(e) => setFormData(prev => ({ ...prev, hasVAT: e.target.checked }))}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
              />
              <span className="ml-2 text-sm font-medium text-foreground">Incluye IVA</span>
            </label>

            {formData.hasVAT && (
              <div className="pl-6">
                <Input
                  label="Tasa de IVA (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="19"
                  value={formData?.vatRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, vatRate: parseFloat(e?.target?.value) || 0 }))}
                  error={errors?.vatRate}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
              className="sm:flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Save"
              iconPosition="left"
              fullWidth
              className="sm:flex-1"
            >
              Crear {formData.type === 'PRODUCT' ? 'Producto' : 'Servicio'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreationModal;