import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AssignmentDetailsModal = ({ assignment, onClose, onUpdate, onDelete, allAssignments }) => {
  const [hours, setHours] = useState(assignment?.hours || 0);
  const [notes, setNotes] = useState(assignment?.notes || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!assignment) return null;

  // Verificar si hay múltiples asignaciones para el mismo request
  const relatedAssignments = allAssignments?.filter(a => a.requestId === assignment.requestId) || [];
  const isFragmented = relatedAssignments.length > 1;
  const totalAssignedHours = relatedAssignments.reduce((sum, a) => sum + a.hours, 0);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...assignment,
        hours: parseFloat(hours),
        notes
      });
    }
    onClose();
  };

  const handleDeleteClick = () => {
    if (isFragmented) {
      setShowDeleteConfirm(true);
    } else {
      handleDelete();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(assignment?.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card rounded-lg shadow-elevation-4 border border-border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Detalles de Asignación
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
            aria-label="Cerrar modal"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div>
            <h3 className="text-base font-caption font-semibold text-foreground mb-2">
              {assignment?.requestTitle}
            </h3>
            <div className="flex items-center gap-3 text-sm font-caption text-muted-foreground">
              <span className="flex items-center gap-1">
                <Icon name="User" size={16} />
                {assignment?.memberName}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="Calendar" size={16} />
                {new Date(assignment.date)?.toLocaleDateString('es-MX', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-xs font-caption text-muted-foreground mb-1">Tipo de Solicitud</p>
              <p className="text-sm font-caption font-medium text-foreground">
                {assignment?.requestType}
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-xs font-caption text-muted-foreground mb-1">Prioridad</p>
              <p className="text-sm font-caption font-medium text-foreground">
                {assignment?.priority}
              </p>
            </div>
          </div>

          <Input
            label="Horas Asignadas"
            type="number"
            value={hours}
            onChange={(e) => setHours(e?.target?.value)}
            min="0"
            max="24"
            step="0.5"
            description="Ajusta las horas asignadas para esta tarea"
          />

          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e?.target?.value)}
              rows={4}
              placeholder="Agrega notas sobre esta asignación..."
              className="w-full px-3 py-2 text-sm font-caption bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {assignment?.estimatedHours && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-caption font-medium text-foreground mb-1">
                    Estimación Original
                  </p>
                  <p className="text-sm font-caption text-muted-foreground">
                    Esta solicitud fue estimada en {assignment?.estimatedHours} horas.
                    Actualmente has asignado {hours} horas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isFragmented && (
            <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
              <div className="flex items-start gap-3">
                <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-caption font-medium text-foreground mb-1">
                    Tarea Fraccionada
                  </p>
                  <p className="text-sm font-caption text-muted-foreground">
                    Esta tarea tiene {relatedAssignments.length} asignaciones distribuidas en diferentes días,
                    con un total de {totalAssignedHours}h asignadas.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <Button
            variant="danger"
            iconName="Trash2"
            onClick={handleDeleteClick}
          >
            Eliminar Asignación
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              iconName="Save"
              onClick={handleSave}
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación para eliminar tarea fraccionada */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
          <div className="bg-card rounded-lg shadow-elevation-4 border border-border p-6 max-w-md w-full">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Icon name="AlertTriangle" size={24} className="text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  ¿Eliminar asignación fraccionada?
                </h3>
                <p className="text-sm font-caption text-muted-foreground">
                  Esta tarea tiene {relatedAssignments.length} asignaciones distribuidas.
                  Al eliminar esta asignación de {assignment.hours}h, quedarán{' '}
                  {totalAssignedHours - assignment.hours}h asignadas en los otros días.
                </p>
                <p className="text-sm font-caption text-muted-foreground mt-2">
                  La tarea volverá a aparecer en "Solicitudes Sin Asignar" si quedan horas pendientes.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                iconName="Trash2"
                onClick={handleDelete}
              >
                Eliminar de Todos Modos
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetailsModal;