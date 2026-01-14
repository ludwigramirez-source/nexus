import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SkillManagementModal = ({ isOpen, onClose, onSave, skill, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'backend',
    level: 'intermediate',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (skill && mode === 'edit') {
      setFormData({
        name: skill?.name,
        category: skill?.category,
        level: skill?.level,
        description: skill?.description
      });
    } else {
      setFormData({
        name: '',
        category: 'backend',
        level: 'intermediate',
        description: ''
      });
    }
    setErrors({});
  }, [skill, mode, isOpen]);

  const categoryOptions = [
    { value: 'backend', label: 'Backend' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'devops', label: 'DevOps' },
    { value: 'database', label: 'Base de Datos' },
    { value: 'mobile', label: 'Móvil' },
    { value: 'design', label: 'Diseño' },
    { value: 'management', label: 'Gestión' },
    { value: 'other', label: 'Otro' }
  ];

  const levelOptions = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' },
    { value: 'expert', label: 'Experto' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'El nombre de la habilidad es requerido';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'La descripción es requerida';
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
            {mode === 'create' ? 'Crear Habilidad' : 'Editar Habilidad'}
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
            label="Nombre de la Habilidad"
            type="text"
            placeholder="Ej: React.js"
            value={formData?.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
            error={errors?.name}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Categoría"
              options={categoryOptions}
              value={formData?.category}
              onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            />

            <Select
              label="Nivel"
              options={levelOptions}
              value={formData?.level}
              onChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Descripción
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              rows="4"
              placeholder="Describe la habilidad y su aplicación..."
              value={formData?.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
            />
            {errors?.description && (
              <p className="text-xs text-error mt-1">{errors?.description}</p>
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
              {mode === 'create' ? 'Crear Habilidad' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillManagementModal;