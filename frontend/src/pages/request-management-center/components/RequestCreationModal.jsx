import React, { useState, useEffect } from 'react';
import { requestService } from '../../../services/requestService';
import { clientService } from '../../../services/clientService';
import { productService } from '../../../services/productService';
import { authService } from '../../../services/authService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RequestCreationModal = ({ isOpen, onClose, onSave, initialData = null, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'CUSTOMIZATION',
    priority: 'MEDIUM',
    clientId: '',
    productId: '',
    estimatedHours: 1
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      const [clientsData, productsData, userData] = await Promise.all([
        clientService.getAll(),
        productService.getAll(),
        authService.getMe()
      ]);

      // Transformar clientes para el Select
      const clientOptions = (clientsData.data || []).map(client => ({
        value: client.id,
        label: client.name,
        description: client.nit || client.email
      }));
      setClients(clientOptions);

      // Transformar productos para el Select
      const productOptions = (productsData.data || []).map(product => ({
        value: product.id,
        label: product.name,
        description: product.type
      }));
      setProducts(productOptions);

      setCurrentUser(userData);

      // Si es modo edición, pre-llenar formulario con datos existentes
      if (isEditMode && initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          type: initialData.type || 'CUSTOMIZATION',
          priority: initialData.priority || 'MEDIUM',
          clientId: initialData.clientId || initialData.client?.id || '',
          productId: initialData.productId || initialData.product?.id || '',
          estimatedHours: initialData.estimatedHours || 1
        });
      } else {
        // Resetear form para crear nueva solicitud
        setFormData({
          title: '',
          description: '',
          type: 'CUSTOMIZATION',
          priority: 'MEDIUM',
          clientId: '',
          productId: '',
          estimatedHours: 1
        });
      }
      setErrors({});
    } catch (error) {
      console.error('Error loading initial data:', error);
      setErrors({ general: 'Error al cargar datos. Por favor intenta de nuevo.' });
    } finally {
      setLoadingData(false);
    }
  };

  const typeOptions = [
    { value: 'PRODUCT_FEATURE', label: 'Característica de Producto' },
    { value: 'CUSTOMIZATION', label: 'Personalización' },
    { value: 'BUG', label: 'Error' },
    { value: 'SUPPORT', label: 'Soporte' },
    { value: 'INFRASTRUCTURE', label: 'Infraestructura' }
  ];

  const priorityOptions = [
    { value: 'CRITICAL', label: 'Crítica' },
    { value: 'HIGH', label: 'Alta' },
    { value: 'MEDIUM', label: 'Media' },
    { value: 'LOW', label: 'Baja' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    } else if (formData.title.length > 200) {
      newErrors.title = 'El título debe tener máximo 200 caracteres';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData?.clientId) {
      newErrors.clientId = 'El cliente es requerido';
    }

    if (!formData?.estimatedHours || formData?.estimatedHours < 1 || formData?.estimatedHours > 200) {
      newErrors.estimatedHours = 'Las horas estimadas deben estar entre 1 y 200';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!currentUser) {
      setErrors({ general: 'No se pudo obtener el usuario actual' });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Preparar datos para enviar al backend
      const requestData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        priority: formData.priority,
        estimatedHours: Number(formData.estimatedHours),
        clientId: formData.clientId,
        productId: formData.productId || undefined, // Opcional
        tags: []
      };

      // Crear o actualizar la solicitud
      let result;
      if (isEditMode && initialData?.id) {
        result = await requestService.update(initialData.id, requestData);
      } else {
        result = await requestService.create(requestData);
      }

      // Notificar al componente padre
      if (onSave) {
        onSave(result, isEditMode);
      }

      // Cerrar modal
      onClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} request:`, error);

      // Extraer mensaje de error del backend
      const errorMessage = error?.response?.data?.message ||
                          error?.response?.data?.error ||
                          error?.message ||
                          `Error al ${isEditMode ? 'actualizar' : 'crear'} la solicitud`;

      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg border border-border shadow-elevation-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
            {isEditMode ? 'Editar Solicitud' : 'Crear Nueva Solicitud'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
            className="h-8 w-8"
            disabled={loading}
          />
        </div>

        {loadingData ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Cargando datos...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
            {errors?.general && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-lg flex items-start gap-2">
                <span className="text-destructive text-lg">⚠️</span>
                <p className="text-sm text-destructive font-semibold flex-1">{errors.general}</p>
              </div>
            )}

            {Object.keys(errors).length > 0 && !errors?.general && (
              <div className="p-3 bg-warning/10 border border-warning rounded-lg flex items-start gap-2">
                <span className="text-warning text-lg">⚠️</span>
                <p className="text-sm text-warning font-semibold flex-1">
                  Por favor corrige los errores en el formulario antes de continuar
                </p>
              </div>
            )}

            <Input
              label="Título"
              type="text"
              placeholder="Ej: Implementar dashboard de analíticas"
              value={formData?.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e?.target?.value }))}
              error={errors?.title}
              required
              disabled={loading}
            />

            <div>
              <label className="block text-sm font-caption font-medium text-foreground mb-2">
                Descripción <span className="text-destructive">*</span>
              </label>
              <textarea
                className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors?.description
                    ? 'border-destructive focus:ring-destructive'
                    : 'border-input focus:ring-primary'
                }`}
                rows="4"
                placeholder="Describe los detalles de la solicitud... (mínimo 10 caracteres)"
                value={formData?.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
                disabled={loading}
                required
              />
              {errors?.description && (
                <p className="text-xs text-destructive mt-1 font-semibold">{errors?.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipo"
                options={typeOptions}
                value={formData?.type}
                onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                required
                disabled={loading}
              />

              <Select
                label="Prioridad"
                options={priorityOptions}
                value={formData?.priority}
                onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                required
                disabled={loading}
              />
            </div>

            <Select
              label="Cliente"
              options={clients}
              value={formData?.clientId}
              onChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}
              placeholder="Buscar cliente..."
              searchable
              required
              error={errors?.clientId}
              disabled={loading}
              loading={loadingData}
            />

            <Select
              label="Producto"
              options={products}
              value={formData?.productId}
              onChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
              placeholder="Buscar producto (opcional)..."
              searchable
              clearable
              disabled={loading}
              loading={loadingData}
              description="Opcional: asocia esta solicitud a un producto específico"
            />

            <Input
              label="Horas Estimadas"
              type="number"
              min="1"
              max="200"
              placeholder="40"
              value={formData?.estimatedHours}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseInt(e?.target?.value) || 1 }))}
              error={errors?.estimatedHours}
              required
              disabled={loading}
            />

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                fullWidth
                className="sm:flex-1"
                disabled={loading}
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
                loading={loading}
                disabled={loading || loadingData}
              >
                {loading ? (isEditMode ? 'Actualizando...' : 'Creando...') : (isEditMode ? 'Actualizar Solicitud' : 'Crear Solicitud')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestCreationModal;
