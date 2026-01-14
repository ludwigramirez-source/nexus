import React from 'react';
import Icon from '../../../components/AppIcon';

const TeamMemberPanel = ({ selectedMember, weeklyStats }) => {
  if (!selectedMember) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-card border-l border-border">
        <Icon name="Users" size={64} className="text-muted-foreground mb-4" />
        <p className="text-sm font-caption text-muted-foreground text-center">
          Selecciona un miembro del equipo para ver detalles
        </p>
      </div>
    );
  }

  const getCapacityColor = (percentage) => {
    if (percentage >= 100) return 'text-error';
    if (percentage >= 80) return 'text-warning';
    if (percentage >= 60) return 'text-accent';
    return 'text-success';
  };

  const skillLevels = {
    'Experto': 'bg-success/10 text-success',
    'Avanzado': 'bg-primary/10 text-primary',
    'Intermedio': 'bg-accent/10 text-accent',
    'Básico': 'bg-muted text-muted-foreground'
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border overflow-y-auto">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3 mb-4">
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

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-background rounded-lg border border-border">
            <p className="text-xs font-caption text-muted-foreground mb-1">Capacidad Semanal</p>
            <p className="text-lg font-heading font-semibold text-foreground">
              {selectedMember?.weeklyCapacity}h
            </p>
          </div>
          <div className="p-3 bg-background rounded-lg border border-border">
            <p className="text-xs font-caption text-muted-foreground mb-1">Utilización</p>
            <p className={`text-lg font-heading font-semibold ${getCapacityColor(selectedMember?.currentUtilization)}`}>
              {selectedMember?.currentUtilization}%
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-caption font-semibold text-foreground mb-3">
          Matriz de Habilidades
        </h4>
        <div className="space-y-2">
          {selectedMember?.skills?.map((skill, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm font-caption text-foreground">{skill?.name}</span>
              <span className={`px-2 py-0.5 text-xs font-caption font-medium rounded ${skillLevels?.[skill?.level]}`}>
                {skill?.level}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-caption font-semibold text-foreground mb-3">
          Carga de Trabajo Actual
        </h4>
        <div className="space-y-3">
          {selectedMember?.currentAssignments?.map((assignment, idx) => (
            <div key={idx} className="p-3 bg-background rounded-lg border border-border">
              <p className="text-sm font-caption font-medium text-foreground mb-2 line-clamp-2">
                {assignment?.title}
              </p>
              <div className="flex items-center justify-between text-xs font-caption text-muted-foreground">
                <span>{assignment?.type}</span>
                <span>{assignment?.hours}h</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-sm font-caption font-semibold text-foreground mb-3">
          Disponibilidad
        </h4>
        <div className="space-y-2">
          {selectedMember?.availability?.map((day, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-background rounded border border-border">
              <span className="text-sm font-caption text-foreground">{day?.day}</span>
              <div className="flex items-center gap-2">
                {day?.available ? (
                  <>
                    <Icon name="Check" size={16} className="text-success" />
                    <span className="text-sm font-caption text-muted-foreground">
                      {day?.hours}h
                    </span>
                  </>
                ) : (
                  <>
                    <Icon name="X" size={16} className="text-error" />
                    <span className="text-sm font-caption text-muted-foreground">
                      No disponible
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
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