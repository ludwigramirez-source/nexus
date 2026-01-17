import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

const AddKeyResultModal = ({ isOpen, onClose, onSubmit, okrTitle }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetValue: '',
    currentValue: '0',
    unit: '',
    weight: '1'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }

    if (!formData.targetValue || parseFloat(formData.targetValue) <= 0) {
      newErrors.targetValue = 'El valor objetivo debe ser mayor a 0';
    }

    if (parseFloat(formData.currentValue) < 0) {
      newErrors.currentValue = 'El valor actual no puede ser negativo';
    }

    if (!formData.unit || formData.unit.length < 1) {
      newErrors.unit = 'Debes especificar una unidad de medida';
    }

    if (!formData.weight || parseFloat(formData.weight) < 0 || parseFloat(formData.weight) > 100) {
      newErrors.weight = 'El peso debe estar entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const krData = {
      title: formData.title,
      targetValue: parseFloat(formData.targetValue),
      currentValue: parseFloat(formData.currentValue),
      unit: formData.unit,
      weight: parseFloat(formData.weight)
    };

    onSubmit(krData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      targetValue: '',
      currentValue: '0',
      unit: '',
      weight: '1'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                Agregar Resultado Clave
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {okrTitle}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              iconName="X"
              iconSize={20}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Nombre del Resultado Clave *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ej: Aumentar usuarios activos mensuales"
              className={`w-full px-3 py-2 text-sm bg-background border ${
                errors.title ? 'border-error' : 'border-input'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-ring`}
            />
            {errors.title && (
              <p className="text-xs text-error mt-1">{errors.title}</p>
            )}
          </div>

          {/* Target Value and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-caption font-medium text-foreground mb-2">
                Valor Objetivo *
              </label>
              <input
                type="number"
                step="any"
                value={formData.targetValue}
                onChange={(e) => handleChange('targetValue', e.target.value)}
                placeholder="100"
                className={`w-full px-3 py-2 text-sm bg-background border ${
                  errors.targetValue ? 'border-error' : 'border-input'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-ring`}
              />
              {errors.targetValue && (
                <p className="text-xs text-error mt-1">{errors.targetValue}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-caption font-medium text-foreground mb-2">
                Unidad *
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                placeholder="usuarios, %, horas"
                className={`w-full px-3 py-2 text-sm bg-background border ${
                  errors.unit ? 'border-error' : 'border-input'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-ring`}
              />
              {errors.unit && (
                <p className="text-xs text-error mt-1">{errors.unit}</p>
              )}
            </div>
          </div>

          {/* Current Value and Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-caption font-medium text-foreground mb-2">
                Valor Actual
              </label>
              <input
                type="number"
                step="any"
                value={formData.currentValue}
                onChange={(e) => handleChange('currentValue', e.target.value)}
                placeholder="0"
                className={`w-full px-3 py-2 text-sm bg-background border ${
                  errors.currentValue ? 'border-error' : 'border-input'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-ring`}
              />
              {errors.currentValue && (
                <p className="text-xs text-error mt-1">{errors.currentValue}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-caption font-medium text-foreground mb-2">
                Peso (%) *
              </label>
              <input
                type="number"
                step="any"
                min="0"
                max="100"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="1"
                className={`w-full px-3 py-2 text-sm bg-background border ${
                  errors.weight ? 'border-error' : 'border-input'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-ring`}
              />
              {errors.weight && (
                <p className="text-xs text-error mt-1">{errors.weight}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Importancia de este KR
              </p>
            </div>
          </div>

          {/* Info text */}
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Peso:</strong> Define la importancia de este resultado clave en el progreso general del OKR.
              Los pesos se usan para calcular el progreso ponderado.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              iconName="Check"
              iconPosition="left"
            >
              Crear Resultado Clave
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddKeyResultModal;
