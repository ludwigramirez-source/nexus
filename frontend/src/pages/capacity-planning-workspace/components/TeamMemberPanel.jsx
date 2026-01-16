import React from 'react';
import Icon from '../../../components/AppIcon';

const TeamMemberPanel = ({ selectedMember, weeklyStats, onClose }) => {
  if (!selectedMember) {
    return null;
  }

  const getCapacityColor = (percentage) => {
    if (percentage >= 100) return 'text-error';
    if (percentage >= 80) return 'text-warning';
    if (percentage >= 60) return 'text-accent';
    return 'text-success';
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border overflow-y-auto">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-caption font-semibold text-primary">
                {selectedMember?.name?.split(' ')?.map(n => n?.[0])?.join('')}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-heading font-semibold text-foreground">
                {selectedMember?.name}
              </h3>
              <p className="text-sm font-caption text-muted-foreground">
                {selectedMember?.role}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose && onClose();
            }}
            className="p-1 hover:bg-muted rounded transition-smooth"
            title="Cerrar panel"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-background rounded-lg border border-border">
            <p className="text-xs font-caption text-muted-foreground mb-1">Capacidad Semanal</p>
            <p className="text-lg font-heading font-semibold text-foreground">
              {selectedMember?.capacity || 0}h
            </p>
          </div>
          <div className="p-3 bg-background rounded-lg border border-border">
            <p className="text-xs font-caption text-muted-foreground mb-1">Utilización</p>
            <p className={`text-lg font-heading font-semibold ${getCapacityColor(weeklyStats?.percentage || 0)}`}>
              {weeklyStats?.percentage || 0}%
            </p>
          </div>
        </div>
      </div>
      {selectedMember?.skills && selectedMember?.skills?.length > 0 && (
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-caption font-semibold text-foreground mb-3">
            Habilidades
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedMember?.skills?.map((skill, idx) => (
              <span key={idx} className="px-2 py-1 text-xs font-caption font-medium rounded bg-primary/10 text-primary">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-caption font-semibold text-foreground mb-3">
          Información del Usuario
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-caption text-muted-foreground">Email:</span>
            <span className="text-sm font-caption text-foreground">{selectedMember?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-caption text-muted-foreground">Estado:</span>
            <span className={`px-2 py-0.5 text-xs font-caption font-medium rounded ${
              selectedMember?.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
            }`}>
              {selectedMember?.status === 'active' ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>
      {weeklyStats && (
        <div className="p-4 border-t border-border bg-muted/30 mt-auto">
          <h4 className="text-sm font-caption font-semibold text-foreground mb-3">
            Estadísticas de la Semana
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-background rounded border border-border">
              <p className="text-xs font-caption text-muted-foreground">Asignadas</p>
              <p className="text-base font-heading font-semibold text-foreground">
                {weeklyStats?.assigned}h
              </p>
            </div>
            <div className="p-2 bg-background rounded border border-border">
              <p className="text-xs font-caption text-muted-foreground">Disponibles</p>
              <p className="text-base font-heading font-semibold text-foreground">
                {weeklyStats?.available}h
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMemberPanel;