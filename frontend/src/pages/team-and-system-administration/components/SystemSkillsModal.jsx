import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { systemConfigService } from '../../../services/systemConfigService';

const SystemSkillsModal = ({ isOpen, onClose }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadSkills();
    }
  }, [isOpen]);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const response = await systemConfigService.getAllSkills();
      setSkills(response?.data?.skills || []);
    } catch (error) {
      console.error('Error loading skills:', error);
      alert('Error al cargar las habilidades');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name) {
      alert('Por favor ingresa el nombre de la habilidad');
      return;
    }

    try {
      await systemConfigService.createSkill(formData);
      alert('Habilidad creada exitosamente');
      setFormData({ name: '', description: '', category: '' });
      loadSkills();
    } catch (error) {
      console.error('Error creating skill:', error);
      alert(error.response?.data?.message || 'Error al crear la habilidad');
    }
  };

  const handleUpdate = async () => {
    if (!formData.name) {
      alert('Por favor ingresa el nombre de la habilidad');
      return;
    }

    try {
      await systemConfigService.updateSkill(editingSkill.id, formData);
      alert('Habilidad actualizada exitosamente');
      setEditingSkill(null);
      setFormData({ name: '', description: '', category: '' });
      loadSkills();
    } catch (error) {
      console.error('Error updating skill:', error);
      alert(error.response?.data?.message || 'Error al actualizar la habilidad');
    }
  };

  const handleDelete = async (skill) => {
    if (!confirm(`¿Estás seguro de eliminar la habilidad "${skill.name}"?`)) {
      return;
    }

    try {
      await systemConfigService.deleteSkill(skill.id);
      alert('Habilidad eliminada exitosamente');
      loadSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert(error.response?.data?.message || 'Error al eliminar la habilidad');
    }
  };

  const startEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      description: skill.description || '',
      category: skill.category || ''
    });
  };

  const cancelEdit = () => {
    setEditingSkill(null);
    setFormData({ name: '', description: '', category: '' });
  };

  // Agrupar skills por categoría
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Sin categoría';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              Gestión de Habilidades
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Administra las habilidades disponibles en el sistema
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Form */}
          <div className="bg-muted/30 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {editingSkill ? 'Editar Habilidad' : 'Crear Nueva Habilidad'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Nombre"
                placeholder="React, Node.js, Python, etc."
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
                required
              />
              <Input
                label="Categoría"
                placeholder="Frontend, Backend, Database, etc."
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e?.target?.value }))}
              />
            </div>
            <Input
              label="Descripción"
              placeholder="Descripción de la habilidad (opcional)"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
            />
            <div className="flex gap-2 mt-4">
              {editingSkill ? (
                <>
                  <Button onClick={handleUpdate} iconName="Save">
                    Guardar Cambios
                  </Button>
                  <Button variant="outline" onClick={cancelEdit} iconName="X">
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={handleCreate} iconName="Plus">
                  Crear Habilidad
                </Button>
              )}
            </div>
          </div>

          {/* Skills List */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Habilidades Existentes ({skills.length})
            </h3>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Loader" size={24} className="animate-spin inline" />
                <p className="mt-2">Cargando habilidades...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {categorySkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-accent transition-smooth"
                        >
                          <div className="flex-1">
                            <span className="font-semibold text-foreground">{skill.name}</span>
                            {skill.description && (
                              <p className="text-xs text-muted-foreground mt-1">{skill.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(skill)}
                              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-smooth"
                              title="Editar habilidad"
                            >
                              <Icon name="Pencil" size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(skill)}
                              className="p-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/20 rounded transition-smooth"
                              title="Eliminar habilidad"
                            >
                              <Icon name="Trash2" size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemSkillsModal;
