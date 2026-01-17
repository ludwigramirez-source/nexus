import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AddOKRModal = ({ isOpen, onClose, onSubmit, currentUserId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quarter: 'Q1',
    year: '2026',
    department: '',
    confidence: 70
  });

  const [errors, setErrors] = useState({});

  const quarterOptions = [
    { value: 'Q1', label: 'Q1 - Primer Trimestre' },
    { value: 'Q2', label: 'Q2 - Segundo Trimestre' },
    { value: 'Q3', label: 'Q3 - Tercer Trimestre' },
    { value: 'Q4', label: 'Q4 - Cuarto Trimestre' }
  ];

  const departmentOptions = [
    { value: '', label: 'Sin departamento' },
    { value: 'Ingeniería', label: 'Ingeniería' },
    { value: 'Producto', label: 'Producto' },
    { value: 'Ventas', label: 'Ventas' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Customer Success', label: 'Customer Success' },
    { value: 'Operaciones', label: 'Operaciones' },
    { value: 'Finanzas', label: 'Finanzas' },
    { value: 'HR', label: 'Recursos Humanos' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.length < 5) {
      newErrors.title = 'El título debe tener al menos 5 caracteres';
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    const year = parseInt(formData.year);
    if (!year || year < 2020 || year > 2030) {
      newErrors.year = 'El año debe estar entre 2020 y 2030';
    }

    if (formData.confidence < 0 || formData.confidence > 100) {
      newErrors.confidence = 'La confianza debe estar entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const okrData = {
      title: formData.title,
      description: formData.description,
      quarter: formData.quarter,
      year: parseInt(formData.year),
      department: formData.department || undefined,
      confidence: formData.confidence,
      ownerId: currentUserId
    };

    onSubmit(okrData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      quarter: 'Q1',
      year: '2026',
      department: '',
      confidence: 70
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
      <div className="relative bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                Crear Nuevo OKR
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Define un objetivo estratégico con sus métricas clave
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

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Título del Objetivo *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ej: Aumentar la satisfacción del cliente"
              className={`w-full px-3 py-2 text-sm bg-background border ${
                errors.title ? 'border-error' : 'border-input'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-ring`}
            />
            {errors.title && (
              <p className="text-xs text-error mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe el objetivo y su importancia estratégica..."
              rows={3}
              className={`w-full px-3 py-2 text-sm bg-background border ${
                errors.description ? 'border-error' : 'border-input'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none`}
            />
            {errors.description && (
              <p className="text-xs text-error mt-1">{errors.description}</p>
            )}
          </div>

          {/* Quarter and Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-caption font-medium text-foreground mb-2">
                Trimestre *
              </label>
              <Select
                options={quarterOptions}
                value={formData.quarter}
                onChange={(value) => handleChange('quarter', value)}
              />
            </div>

            <div>
              <label className="block text-sm font-caption font-medium text-foreground mb-2">
                Año *
              </label>
              <input
                type="number"
                min="2020"
                max="2030"
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-background border ${
                  errors.year ? 'border-error' : 'border-input'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-ring`}
              />
              {errors.year && (
                <p className="text-xs text-error mt-1">{errors.year}</p>
              )}
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Departamento (Opcional)
            </label>
            <Select
              options={departmentOptions}
              value={formData.department}
              onChange={(value) => handleChange('department', value)}
            />
          </div>

          {/* Confidence Level */}
          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Nivel de Confianza Inicial: {formData.confidence}%
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.confidence}
                onChange={(e) => handleChange('confidence', parseInt(e.target.value))}
                className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={formData.confidence}
                onChange={(e) => handleChange('confidence', parseInt(e.target.value) || 0)}
                className={`w-20 px-3 py-2 text-sm bg-background border ${
                  errors.confidence ? 'border-error' : 'border-input'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-center`}
              />
            </div>
            {errors.confidence && (
              <p className="text-xs text-error mt-1">{errors.confidence}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Indica tu nivel de confianza inicial en alcanzar este objetivo (0-100%)
            </p>
          </div>

          {/* Info box */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <h4 className="text-sm font-caption font-medium text-foreground mb-2">
              ¿Qué es un OKR?
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• <strong>Objetivo:</strong> Meta cualitativa que quieres alcanzar</li>
              <li>• <strong>Key Results:</strong> Métricas específicas que indican el progreso</li>
              <li>• <strong>Confianza:</strong> Tu estimación de éxito (actualízala según avances)</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
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
              iconName="Target"
              iconPosition="left"
            >
              Crear OKR
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOKRModal;
