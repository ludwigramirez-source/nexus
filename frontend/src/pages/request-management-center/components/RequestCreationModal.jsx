import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RequestCreationModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'customization',
    priority: 'medium',
    client: '',
    estimatedHours: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        type: 'customization',
        priority: 'medium',
        client: '',
        estimatedHours: 0
      });
      setErrors({});
    }
  }, [isOpen]);

  const typeOptions = [
    { value: 'product_feature', label: 'Característica de Producto' },
    { value: 'customization', label: 'Personalización' },
    { value: 'bug', label: 'Error' },
    { value: 'support', label: 'Soporte' },
    { value: 'infrastructure', label: 'Infraestructura' }
  ];

  const priorityOptions = [
    { value: 'critical', label: 'Crítica' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' },
    { value: 'low', label: 'Baja' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData?.client?.trim()) {
      newErrors.client = 'El cliente es requerido';
    }

    if (formData?.estimatedHours < 1 || formData?.estimatedHours > 200) {
      newErrors.estimatedHours = 'Las horas estimadas deben estar entre 1 y 200';
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
            Crear Nueva Solicitud
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
          <Input
            label="Título"
            type="text"
            placeholder="Ej: Implementar dashboard de analíticas"
            value={formData?.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e?.target?.value }))}
            error={errors?.title}
            required
          />

          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Descripción
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              rows="4"
              placeholder="Describe los detalles de la solicitud..."
              value={formData?.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
            />
            {errors?.description && (
              <p className="text-xs text-error mt-1">{errors?.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tipo"
              options={typeOptions}
              value={formData?.type}
              onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              required
            />

            <Select
              label="Prioridad"
              options={priorityOptions}
              value={formData?.priority}
              onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Cliente"
              type="text"
              placeholder="Ej: TechMex Solutions"
              value={formData?.client}
              onChange={(e) => setFormData(prev => ({ ...prev, client: e?.target?.value }))}
              error={errors?.client}
              required
            />

            <Input
              label="Horas Estimadas"
              type="number"
              min="1"
              max="200"
              placeholder="40"
              value={formData?.estimatedHours}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseInt(e?.target?.value) || 0 }))}
              error={errors?.estimatedHours}
              required
            />
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
              Crear Solicitud
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestCreationModal;