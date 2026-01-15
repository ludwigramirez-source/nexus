import React, { useState, useEffect, useMemo } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import MultiSelect from '../../../components/ui/MultiSelect';
import Icon from '../../../components/AppIcon';

const ClientCreationModal = ({ isOpen, onClose, onSave, products = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    nit: '',
    email: '',
    contactPerson: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    products: [],
    healthScore: 75,
    tier: 'BASIC',
    mrr: 0,
    currency: 'USD',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [productSearch, setProductSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        nit: '',
        email: '',
        contactPerson: '',
        phone: '',
        website: '',
        address: '',
        city: '',
        products: [],
        healthScore: 75,
        tier: 'BASIC',
        mrr: 0,
        currency: 'USD',
        notes: ''
      });
      setErrors({});
      setProductSearch('');
      setCurrentPage(1);
    }
  }, [isOpen]);

  // Filtrar y paginar productos
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;

    const searchLower = productSearch.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.type.toLowerCase().includes(searchLower)
    );
  }, [products, productSearch]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset a página 1 cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [productSearch]);

  const tierOptions = [
    { value: 'ENTERPRISE', label: 'Enterprise' },
    { value: 'PRO', label: 'Professional' },
    { value: 'BASIC', label: 'Básico' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD - Dólar Estadounidense' },
    { value: 'COP', label: 'COP - Peso Colombiano' },
    { value: 'MXN', label: 'MXN - Peso Mexicano' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - Libra Esterlina' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'El nombre del cliente es requerido';
    }

    if (formData?.healthScore < 0 || formData?.healthScore > 100) {
      newErrors.healthScore = 'El score de salud debe estar entre 0 y 100';
    }

    if (formData?.mrr < 0) {
      newErrors.mrr = 'El MRR debe ser mayor o igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      // Calcular MRR y currency automáticamente basado en productos seleccionados
      const selectedProducts = products.filter(p => formData?.products?.includes(p.id));
      const calculatedMRR = selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);
      const calculatedCurrency = selectedProducts[0]?.currency || 'USD';

      const dataToSave = {
        ...formData,
        mrr: calculatedMRR,
        currency: calculatedCurrency
      };

      onSave(dataToSave);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg border border-border shadow-elevation-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
            Crear Nuevo Cliente
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
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del Cliente"
                type="text"
                placeholder="Ej: Grupo Financiero Azteca"
                value={formData?.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
                error={errors?.name}
                required
              />

              <Input
                label="NIT / Identificación Tributaria"
                type="text"
                placeholder="Ej: 900123456-7"
                value={formData?.nit}
                onChange={(e) => setFormData(prev => ({ ...prev, nit: e?.target?.value }))}
              />
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="contacto@empresa.com"
                value={formData?.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e?.target?.value }))}
              />

              <Input
                label="Persona de Contacto"
                type="text"
                placeholder="Juan Pérez"
                value={formData?.contactPerson}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e?.target?.value }))}
              />

              <Input
                label="Teléfono"
                type="tel"
                placeholder="+57 300 123 4567"
                value={formData?.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e?.target?.value }))}
              />

              <Input
                label="Sitio Web"
                type="url"
                placeholder="https://empresa.com"
                value={formData?.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e?.target?.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Ciudad"
                type="text"
                placeholder="Ciudad de México"
                value={formData?.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e?.target?.value }))}
              />

              <Input
                label="Dirección"
                type="text"
                placeholder="Calle 123 #45-67"
                value={formData?.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e?.target?.value }))}
              />
            </div>
          </div>

          {/* Productos y Servicios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Productos y Servicios Contratados
            </h3>

            {products.length === 0 ? (
              <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 text-center">
                No hay productos disponibles. Crea productos primero para asociarlos.
              </div>
            ) : (
              <>
                {/* Campo de búsqueda */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar productos o servicios..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    prefix={<Icon name="Search" size={16} />}
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  )}
                </div>

                {/* Lista de productos paginados */}
                {filteredProducts.length === 0 ? (
                  <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 text-center">
                    No se encontraron productos que coincidan con "{productSearch}"
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 border border-border rounded-lg p-3">
                      {paginatedProducts.map((product) => {
                        const isSelected = formData?.products?.includes(product.id);
                        return (
                          <label
                            key={product.id}
                            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-smooth hover:bg-muted/50 ${
                              isSelected ? 'bg-primary/10 border border-primary/30' : 'border border-transparent'
                            }`}
                          >
                            <div className="flex items-center flex-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const newProducts = e.target.checked
                                    ? [...(formData?.products || []), product.id]
                                    : (formData?.products || []).filter(id => id !== product.id);
                                  setFormData(prev => ({ ...prev, products: newProducts }));
                                }}
                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                              />
                              <div className="ml-3 flex-1">
                                <span className="text-sm font-medium text-foreground">{product.name}</span>
                                <span className="ml-2 text-xs text-muted-foreground">
                                  ({product.type === 'PRODUCT' ? 'Producto' : 'Servicio'})
                                </span>
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: product.currency || 'USD',
                                minimumFractionDigits: 0
                              }).format(product.price || 0)}
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {/* Controles de paginación */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-sm text-muted-foreground">
                          Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length} productos
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            iconName="ChevronLeft"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                          />
                          <span className="text-sm font-medium text-foreground">
                            {currentPage} / {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            iconName="ChevronRight"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* MRR Calculado */}
            {formData?.products?.length > 0 && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">MRR Calculado:</span>
                  <span className="text-lg font-heading font-bold text-primary">
                    {(() => {
                      const selectedProducts = products.filter(p => formData?.products?.includes(p.id));
                      const totalMRR = selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);
                      // Usar la moneda del primer producto seleccionado o USD por defecto
                      const currency = selectedProducts[0]?.currency || 'USD';
                      return new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: currency,
                        minimumFractionDigits: 0
                      }).format(totalMRR);
                    })()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Basado en {formData?.products?.length} producto(s) seleccionado(s)
                </p>
              </div>
            )}
          </div>

          {/* Métricas y Clasificación */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Métricas y Clasificación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Score de Salud (0-100)"
                type="number"
                min="0"
                max="100"
                placeholder="75"
                value={formData?.healthScore}
                onChange={(e) => setFormData(prev => ({ ...prev, healthScore: parseInt(e?.target?.value) || 0 }))}
                error={errors?.healthScore}
                required
              />

              <Select
                label="Nivel"
                options={tierOptions}
                value={formData?.tier}
                onChange={(value) => setFormData(prev => ({ ...prev, tier: value }))}
                required
              />

              <Select
                label="Moneda"
                options={currencyOptions}
                value={formData?.currency}
                onChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                required
              />
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Notas Adicionales
            </h3>
            <div>
              <label className="block text-sm font-caption font-medium text-foreground mb-2">
                Observaciones
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                rows="3"
                placeholder="Notas adicionales sobre el cliente..."
                value={formData?.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e?.target?.value }))}
              />
            </div>
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
              Crear Cliente
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientCreationModal;