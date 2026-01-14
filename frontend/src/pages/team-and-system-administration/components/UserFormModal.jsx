import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { systemConfigService } from '../../../services/systemConfigService';

const UserFormModal = ({ isOpen, onClose, onSave, user, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'backend',
    capacity: 40,
    skills: [],
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(false);

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        name: user?.name,
        email: user?.email,
        password: '',
        confirmPassword: '',
        role: user?.role,
        capacity: user?.capacity,
        skills: user?.skills,
        status: user?.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'backend',
        capacity: 40,
        skills: [],
        status: 'active'
      });
    }
    setErrors({});
    setShowPassword(false);
  }, [user, mode, isOpen]);

  // Cargar roles y skills disponibles
  useEffect(() => {
    const loadSystemConfig = async () => {
      if (isOpen) {
        setLoadingConfig(true);
        try {
          const [rolesResponse, skillsResponse] = await Promise.all([
            systemConfigService.getAllRoles(),
            systemConfigService.getAllSkills()
          ]);

          // Transformar roles del backend al formato esperado por el Select
          const rolesFormatted = rolesResponse?.data?.roles?.map(role => ({
            value: role.name.toLowerCase(),
            label: role.label
          })) || [];

          setAvailableRoles(rolesFormatted);
          setAvailableSkills(skillsResponse?.data?.skills || []);
        } catch (error) {
          console.error('Error loading system config:', error);
          // Usar valores por defecto si falla
          setAvailableRoles([
            { value: 'ceo', label: 'CEO' },
            { value: 'dev_director', label: 'Director de Desarrollo' },
            { value: 'backend', label: 'Desarrollador Backend' },
            { value: 'frontend', label: 'Desarrollador Frontend' },
            { value: 'fullstack', label: 'Desarrollador Full Stack' }
          ]);
        } finally {
          setLoadingConfig(false);
        }
      }
    };

    loadSystemConfig();
  }, [isOpen]);

  const roleOptions = availableRoles;

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar contraseña
    if (mode === 'create') {
      // En modo crear, la contraseña es obligatoria
      if (!formData?.password?.trim()) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData?.password?.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }

      if (!formData?.confirmPassword?.trim()) {
        newErrors.confirmPassword = 'Confirme la contraseña';
      } else if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    } else {
      // En modo editar, la contraseña es opcional (solo si se quiere cambiar)
      if (formData?.password?.trim() || formData?.confirmPassword?.trim()) {
        if (formData?.password && formData?.password?.length < 8) {
          newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (formData?.password !== formData?.confirmPassword) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
      }
    }

    if (formData?.capacity < 1 || formData?.capacity > 60) {
      newErrors.capacity = 'La capacidad debe estar entre 1 y 60 horas';
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

  const handleAddSkill = () => {
    if (skillInput?.trim() && !formData?.skills?.includes(skillInput?.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev?.skills, skillInput?.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev?.skills?.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      e?.preventDefault();
      handleAddSkill();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg border border-border shadow-elevation-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
            {mode === 'create' ? 'Agregar Usuario' : 'Editar Usuario'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre completo"
              type="text"
              placeholder="Ej: Carlos Rodríguez"
              value={formData?.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
              error={errors?.name}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="carlos@iptegra.com"
              value={formData?.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e?.target?.value }))}
              error={errors?.email}
              required
            />
          </div>

          {/* Campos de contraseña */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label={mode === 'create' ? 'Contraseña' : 'Nueva Contraseña (opcional)'}
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'create' ? 'Mínimo 8 caracteres' : 'Dejar vacío para no cambiar'}
                value={formData?.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e?.target?.value }))}
                error={errors?.password}
                required={mode === 'create'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
              </button>
            </div>

            <Input
              label={mode === 'create' ? 'Confirmar Contraseña' : 'Confirmar Nueva Contraseña'}
              type={showPassword ? 'text' : 'password'}
              placeholder={mode === 'create' ? 'Repita la contraseña' : 'Confirme la nueva contraseña'}
              value={formData?.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e?.target?.value }))}
              error={errors?.confirmPassword}
              required={mode === 'create'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Rol"
              options={roleOptions}
              value={formData?.role}
              onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
              required
            />

            <Input
              label="Capacidad (horas/semana)"
              type="number"
              min="1"
              max="60"
              placeholder="40"
              value={formData?.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e?.target?.value) || 0 }))}
              error={errors?.capacity}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Habilidades
            </label>

            {/* Habilidades del sistema disponibles */}
            {availableSkills.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-2">Habilidades disponibles:</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {availableSkills
                    .filter(skill => !formData?.skills?.includes(skill.name))
                    .map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          skills: [...prev.skills, skill.name]
                        }))}
                        className="px-2 py-1 text-xs rounded-md bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-smooth border border-border"
                        title={skill.description}
                      >
                        <Icon name="Plus" size={12} className="inline mr-1" />
                        {skill.name}
                        {skill.category && <span className="text-[10px] ml-1 opacity-60">({skill.category})</span>}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Input manual para agregar habilidades personalizadas */}
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                placeholder="O agrega una habilidad personalizada"
                value={skillInput}
                onChange={(e) => setSkillInput(e?.target?.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                type="button"
                variant="outline"
                iconName="Plus"
                onClick={handleAddSkill}
              >
                Agregar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData?.skills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-foreground text-sm font-caption"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-error transition-smooth"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Select
            label="Estado"
            options={statusOptions}
            value={formData?.status}
            onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            required
          />

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
              {mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;