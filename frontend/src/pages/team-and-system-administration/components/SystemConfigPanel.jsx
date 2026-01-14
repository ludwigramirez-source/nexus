import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { storeEncrypted, retrieveEncrypted } from '../../../services/encryptionService';
import { reinitializeClient } from '../../../services/openaiClient';
import { testConnection } from '../../../services/openaiAnalyticsService';

const SystemConfigPanel = ({ config, onSave }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState(config);
  const [hasChanges, setHasChanges] = useState(false);
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'products', label: 'Productos', icon: 'Package' },
    { id: 'clients', label: 'Clientes', icon: 'Users' },
    { id: 'okrs', label: 'OKRs', icon: 'Target' },
    { id: 'integrations', label: 'Integraciones', icon: 'Plug' }
  ];

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(formData);
    setHasChanges(false);
  };

  const handleReset = () => {
    setFormData(config);
    setHasChanges(false);
  };

  const handleSaveApiKey = async () => {
    try {
      if (!openaiApiKey?.trim()) {
        setConnectionStatus({ success: false, message: 'Por favor ingresa una clave API válida' });
        return;
      }

      // Store encrypted API key
      storeEncrypted('openai_api_key', openaiApiKey);
      
      // Reinitialize OpenAI client with new key
      reinitializeClient();
      
      setConnectionStatus({ success: true, message: 'Clave API guardada y cifrada correctamente' });
      setOpenaiApiKey('');
      setShowApiKey(false);
      
      setTimeout(() => setConnectionStatus(null), 5000);
    } catch (error) {
      setConnectionStatus({ success: false, message: error?.message || 'Error al guardar la clave API' });
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    
    try {
      await testConnection();
      setConnectionStatus({ success: true, message: 'Conexión exitosa con OpenAI' });
    } catch (error) {
      setConnectionStatus({ success: false, message: error?.message });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('openai_api_key');
    reinitializeClient();
    setConnectionStatus({ success: true, message: 'Clave API eliminada correctamente' });
    setTimeout(() => setConnectionStatus(null), 3000);
  };

  const isApiKeyConfigured = () => {
    return !!retrieveEncrypted('openai_api_key');
  };

  const currencyOptions = [
    { value: 'MXN', label: 'Peso Mexicano (MXN)' },
    { value: 'USD', label: 'Dólar Estadounidense (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'COP', label: 'Peso Colombiano (COP)' }
  ];

  const timezoneOptions = [
    { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
    { value: 'America/Monterrey', label: 'Monterrey (GMT-6)' },
    { value: 'America/Cancun', label: 'Cancún (GMT-5)' },
    { value: 'America/Bogota', label: 'Bogotá, Colombia (GMT-5)' }
  ];

  const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1">
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-sm font-caption font-medium whitespace-nowrap transition-smooth
                ${activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon name={tab?.icon} size={18} />
              <span className="hidden sm:inline">{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 md:p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                Configuración General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre de la empresa"
                  type="text"
                  value={formData?.general?.companyName}
                  onChange={(e) => handleChange('general', 'companyName', e?.target?.value)}
                />
                <Input
                  label="Email de contacto"
                  type="email"
                  value={formData?.general?.contactEmail}
                  onChange={(e) => handleChange('general', 'contactEmail', e?.target?.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                Configuración Regional
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Moneda"
                  options={currencyOptions}
                  value={formData?.general?.currency}
                  onChange={(value) => handleChange('general', 'currency', value)}
                />
                <Select
                  label="Zona horaria"
                  options={timezoneOptions}
                  value={formData?.general?.timezone}
                  onChange={(value) => handleChange('general', 'timezone', value)}
                />
                <Select
                  label="Formato de fecha"
                  options={dateFormatOptions}
                  value={formData?.general?.dateFormat}
                  onChange={(value) => handleChange('general', 'dateFormat', value)}
                />
                <Input
                  label="Idioma"
                  type="text"
                  value={formData?.general?.language}
                  disabled
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                Notificaciones
              </h3>
              <div className="space-y-3">
                <Checkbox
                  label="Alertas de capacidad excedida"
                  description="Recibir notificaciones cuando la capacidad del equipo supere el 100%"
                  checked={formData?.general?.notifications?.capacityAlerts}
                  onChange={(e) => handleChange('general', 'notifications', {
                    ...formData?.general?.notifications,
                    capacityAlerts: e?.target?.checked
                  })}
                />
                <Checkbox
                  label="Actualizaciones de solicitudes"
                  description="Notificar cambios de estado en solicitudes asignadas"
                  checked={formData?.general?.notifications?.requestUpdates}
                  onChange={(e) => handleChange('general', 'notifications', {
                    ...formData?.general?.notifications,
                    requestUpdates: e?.target?.checked
                  })}
                />
                <Checkbox
                  label="Recordatorios de OKRs"
                  description="Enviar recordatorios semanales sobre progreso de objetivos"
                  checked={formData?.general?.notifications?.okrReminders}
                  onChange={(e) => handleChange('general', 'notifications', {
                    ...formData?.general?.notifications,
                    okrReminders: e?.target?.checked
                  })}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                Configuración de Productos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ratio objetivo Producto/Personalización (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={formData?.products?.targetRatio}
                  onChange={(e) => handleChange('products', 'targetRatio', parseInt(e?.target?.value) || 0)}
                  description="Porcentaje ideal de tiempo dedicado a desarrollo de producto"
                />
                <Input
                  label="Umbral de alerta de ratio (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={formData?.products?.ratioAlertThreshold}
                  onChange={(e) => handleChange('products', 'ratioAlertThreshold', parseInt(e?.target?.value) || 0)}
                  description="Notificar cuando el ratio caiga por debajo de este valor"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                Categorías de Solicitudes
              </h3>
              <div className="space-y-3">
                <Checkbox
                  label="Característica de producto"
                  checked={formData?.products?.requestCategories?.productFeature}
                  onChange={(e) => handleChange('products', 'requestCategories', {
                    ...formData?.products?.requestCategories,
                    productFeature: e?.target?.checked
                  })}
                />
                <Checkbox
                  label="Personalización de cliente"
                  checked={formData?.products?.requestCategories?.customization}
                  onChange={(e) => handleChange('products', 'requestCategories', {
                    ...formData?.products?.requestCategories,
                    customization: e?.target?.checked
                  })}
                />
                <Checkbox
                  label="Corrección de errores"
                  checked={formData?.products?.requestCategories?.bugFix}
                  onChange={(e) => handleChange('products', 'requestCategories', {
                    ...formData?.products?.requestCategories,
                    bugFix: e?.target?.checked
                  })}
                />
                <Checkbox
                  label="Soporte técnico"
                  checked={formData?.products?.requestCategories?.support}
                  onChange={(e) => handleChange('products', 'requestCategories', {
                    ...formData?.products?.requestCategories,
                    support: e?.target?.checked
                  })}
                />
                <Checkbox
                  label="Infraestructura"
                  checked={formData?.products?.requestCategories?.infrastructure}
                  onChange={(e) => handleChange('products', 'requestCategories', {
                    ...formData?.products?.requestCategories,
                    infrastructure: e?.target?.checked
                  })}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                Configuración de Clientes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Umbral de salud crítica"
                  type="number"
                  min="0"
                  max="100"
                  value={formData?.clients?.healthScoreThreshold}
                  onChange={(e) => handleChange('clients', 'healthScoreThreshold', parseInt(e?.target?.value) || 0)}
                  description="Puntuación por debajo de la cual se considera crítico"
                />
                <Input
                  label="Días para revisión de salud"
                  type="number"
                  min="1"
                  max="365"
                  value={formData?.clients?.healthCheckInterval}
                  onChange={(e) => handleChange('clients', 'healthCheckInterval', parseInt(e?.target?.value) || 0)}
                  description="Frecuencia de evaluación automática"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                Niveles de Cliente
              </h3>
              <div className="space-y-3">
                <Checkbox
                  label="Enterprise"
                  description="Clientes con contratos de alto valor y soporte prioritario"
                  checked={formData?.clients?.tiers?.enterprise}
                  onChange={(e) => handleChange('clients', 'tiers', {
                    ...formData?.clients?.tiers,
                    enterprise: e?.target?.checked
                  })}
                />
                <Checkbox
                  label="Professional"
                  description="Clientes con necesidades avanzadas y soporte estándar"
                  checked={formData?.clients?.tiers?.professional}
                  onChange={(e) => handleChange('clients', 'tiers', {
                    ...formData?.clients?.tiers,
                    professional: e?.target?.checked
                  })}
                />
                <Checkbox
                  label="Standard"
                  description="Clientes con funcionalidades básicas"
                  checked={formData?.clients?.tiers?.standard}
                  onChange={(e) => handleChange('clients', 'tiers', {
                    ...formData?.clients?.tiers,
                    standard: e?.target?.checked
                  })}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'okrs' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                Configuración de OKRs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Duración del ciclo (semanas)"
                  type="number"
                  min="1"
                  max="52"
                  value={formData?.okrs?.cycleDuration}
                  onChange={(e) => handleChange('okrs', 'cycleDuration', parseInt(e?.target?.value) || 0)}
                  description="Duración estándar de un ciclo de OKRs"
                />
                <Input
                  label="Umbral de progreso en riesgo (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={formData?.okrs?.atRiskThreshold}
                  onChange={(e) => handleChange('okrs', 'atRiskThreshold', parseInt(e?.target?.value) || 0)}
                  description="Progreso por debajo del cual se marca como en riesgo"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                Recordatorios y Notificaciones
              </h3>
              <div className="space-y-3">
                <Checkbox
                  label="Recordatorios semanales de actualización"
                  description="Enviar recordatorios para actualizar el progreso de OKRs"
                  checked={formData?.okrs?.weeklyReminders}
                  onChange={(e) => handleChange('okrs', 'weeklyReminders', e?.target?.checked)}
                />
                <Checkbox
                  label="Alertas de objetivos en riesgo"
                  description="Notificar cuando un objetivo esté por debajo del umbral"
                  checked={formData?.okrs?.atRiskAlerts}
                  onChange={(e) => handleChange('okrs', 'atRiskAlerts', e?.target?.checked)}
                />
                <Checkbox
                  label="Resumen de fin de ciclo"
                  description="Generar informe automático al finalizar cada ciclo"
                  checked={formData?.okrs?.endOfCycleSummary}
                  onChange={(e) => handleChange('okrs', 'endOfCycleSummary', e?.target?.checked)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                Integración con OpenAI
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={20} className="text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground mb-2">
                      Configura tu clave API de OpenAI para habilitar análisis avanzados con inteligencia artificial en el dashboard de analítica.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      La clave será cifrada y almacenada de forma segura. No se mostrará en texto plano.
                    </p>
                  </div>
                </div>
              </div>

              {isApiKeyConfigured() && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="CheckCircle" size={20} className="text-success" />
                      <span className="text-sm font-medium text-success">
                        Clave API configurada
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveApiKey}
                      iconName="Trash2"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    label="Clave API de OpenAI"
                    type={showApiKey ? 'text' : 'password'}
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e?.target?.value)}
                    placeholder="sk-..."
                    description="Ingresa tu clave API de OpenAI (comienza con sk-)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name={showApiKey ? 'EyeOff' : 'Eye'} size={18} />
                  </button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveApiKey}
                    disabled={!openaiApiKey?.trim()}
                    iconName="Save"
                  >
                    Guardar Clave API
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={!isApiKeyConfigured()}
                    loading={testingConnection}
                    iconName="Zap"
                  >
                    Probar Conexión
                  </Button>
                </div>

                {connectionStatus && (
                  <div className={`rounded-lg p-3 ${
                    connectionStatus?.success 
                      ? 'bg-success/10 border border-success/20' :'bg-error/10 border border-error/20'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Icon 
                        name={connectionStatus?.success ? 'CheckCircle' : 'AlertCircle'} 
                        size={18} 
                        className={connectionStatus?.success ? 'text-success' : 'text-error'}
                      />
                      <span className={`text-sm ${
                        connectionStatus?.success ? 'text-success' : 'text-error'
                      }`}>
                        {connectionStatus?.message}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  ¿Cómo obtener una clave API?
                </h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Visita <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.openai.com/api-keys</a></li>
                  <li>Inicia sesión o crea una cuenta de OpenAI</li>
                  <li>Haz clic en "Create new secret key"</li>
                  <li>Copia la clave y pégala arriba</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
      {hasChanges && (
        <div className="px-4 md:px-6 py-4 border-t border-border bg-muted/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm font-caption text-muted-foreground">
              Tienes cambios sin guardar
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleReset}
                fullWidth
                className="sm:w-auto"
              >
                Descartar
              </Button>
              <Button
                variant="default"
                iconName="Save"
                iconPosition="left"
                onClick={handleSave}
                fullWidth
                className="sm:w-auto"
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemConfigPanel;