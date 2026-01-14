import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkOperationsBar = ({ selectedCount, onRecalculateHealth, onReassignTier, onSendCommunication, onClearSelection }) => {
  const [showTierModal, setShowTierModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');
  const [communicationType, setCommunicationType] = useState('');

  const tierOptions = [
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'professional', label: 'Professional' },
    { value: 'standard', label: 'Standard' },
    { value: 'basic', label: 'Básico' }
  ];

  const communicationOptions = [
    { value: 'health_check', label: 'Revisión de Salud' },
    { value: 'renewal_reminder', label: 'Recordatorio de Renovación' },
    { value: 'upsell', label: 'Oportunidad de Upgrade' },
    { value: 'at_risk', label: 'Alerta de Cliente en Riesgo' }
  ];

  const handleReassignTier = () => {
    if (selectedTier) {
      onReassignTier(selectedTier);
      setShowTierModal(false);
      setSelectedTier('');
    }
  };

  const handleSendCommunication = () => {
    if (communicationType) {
      onSendCommunication(communicationType);
      setShowCommunicationModal(false);
      setCommunicationType('');
    }
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-4xl px-4">
        <div className="bg-primary text-primary-foreground rounded-lg shadow-elevation-5 p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-foreground/20 rounded-full">
                <Icon name="CheckSquare" size={20} />
              </div>
              <div>
                <p className="text-sm md:text-base font-caption font-semibold">
                  {selectedCount} {selectedCount === 1 ? 'cliente seleccionado' : 'clientes seleccionados'}
                </p>
                <p className="text-xs font-caption opacity-80">
                  Selecciona una operación para aplicar
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={onRecalculateHealth}
              >
                Recalcular Salud
              </Button>
              <Button
                variant="secondary"
                size="sm"
                iconName="Tag"
                iconPosition="left"
                onClick={() => setShowTierModal(true)}
              >
                Reasignar Nivel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                iconName="Mail"
                iconPosition="left"
                onClick={() => setShowCommunicationModal(true)}
              >
                Enviar Comunicación
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={onClearSelection}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showTierModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-elevation-4 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-heading font-semibold text-foreground">
                Reasignar Nivel de Cliente
              </h4>
              <button
                onClick={() => setShowTierModal(false)}
                className="p-1 rounded-lg hover:bg-muted transition-smooth"
              >
                <Icon name="X" size={20} className="text-muted-foreground" />
              </button>
            </div>

            <p className="text-sm font-caption text-muted-foreground mb-4">
              Esta acción cambiará el nivel de {selectedCount} {selectedCount === 1 ? 'cliente' : 'clientes'}.
            </p>

            <Select
              label="Nuevo Nivel"
              options={tierOptions}
              value={selectedTier}
              onChange={setSelectedTier}
              placeholder="Selecciona un nivel"
              className="mb-4"
            />

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowTierModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                onClick={handleReassignTier}
                disabled={!selectedTier}
              >
                Aplicar Cambio
              </Button>
            </div>
          </div>
        </div>
      )}

      {showCommunicationModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-elevation-4 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-heading font-semibold text-foreground">
                Enviar Comunicación
              </h4>
              <button
                onClick={() => setShowCommunicationModal(false)}
                className="p-1 rounded-lg hover:bg-muted transition-smooth"
              >
                <Icon name="X" size={20} className="text-muted-foreground" />
              </button>
            </div>

            <p className="text-sm font-caption text-muted-foreground mb-4">
              Selecciona el tipo de comunicación para enviar a {selectedCount} {selectedCount === 1 ? 'cliente' : 'clientes'}.
            </p>

            <Select
              label="Tipo de Comunicación"
              options={communicationOptions}
              value={communicationType}
              onChange={setCommunicationType}
              placeholder="Selecciona un tipo"
              className="mb-4"
            />

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCommunicationModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                onClick={handleSendCommunication}
                disabled={!communicationType}
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkOperationsBar;