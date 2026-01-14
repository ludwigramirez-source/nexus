import React from 'react';
import Icon from '../../../components/AppIcon';

const CapacityHeatmap = ({ weekData, onCellClick }) => {
  const getUtilizationColor = (percentage) => {
    if (percentage >= 100) return 'bg-error text-error-foreground';
    if (percentage >= 85) return 'bg-warning text-warning-foreground';
    if (percentage >= 70) return 'bg-accent text-accent-foreground';
    if (percentage >= 50) return 'bg-success/70 text-success-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const getUtilizationLabel = (percentage) => {
    if (percentage >= 100) return 'Sobrecargado';
    if (percentage >= 85) return 'Alto';
    if (percentage >= 70) return 'Óptimo';
    if (percentage >= 50) return 'Moderado';
    return 'Bajo';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Mapa de Calor de Capacidad
          </h3>
          <p className="text-xs md:text-sm font-caption text-muted-foreground mt-1">
            Utilización semanal del equipo
          </p>
        </div>
        <Icon name="Calendar" size={20} className="text-muted-foreground md:w-6 md:h-6" />
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-6 gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="text-xs md:text-sm font-caption font-medium text-muted-foreground">
              Miembro
            </div>
            {weekData?.[0]?.days?.map((day, index) => (
              <div key={index} className="text-xs md:text-sm font-caption font-medium text-center text-muted-foreground">
                {day?.label}
              </div>
            ))}
          </div>

          <div className="space-y-2 md:space-y-3">
            {weekData?.map((member, memberIndex) => (
              <div key={memberIndex} className="grid grid-cols-6 gap-2 md:gap-3">
                <div className="flex items-center">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs md:text-sm font-caption font-medium text-primary">
                        {member?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm font-caption font-medium text-foreground truncate">
                      {member?.name}
                    </span>
                  </div>
                </div>

                {member?.days?.map((day, dayIndex) => (
                  <button
                    key={dayIndex}
                    onClick={() => onCellClick && onCellClick(member, day)}
                    className={`
                      p-2 md:p-3 rounded-lg transition-smooth hover:opacity-80
                      ${getUtilizationColor(day?.utilization)}
                    `}
                  >
                    <div className="text-center">
                      <div className="text-sm md:text-base font-caption font-bold data-text">
                        {day?.utilization}%
                      </div>
                      <div className="text-[10px] md:text-xs font-caption mt-0.5">
                        {day?.hours}h
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-muted" />
          <span className="text-xs md:text-sm font-caption text-muted-foreground">&lt;50%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-success/70" />
          <span className="text-xs md:text-sm font-caption text-muted-foreground">50-70%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-accent" />
          <span className="text-xs md:text-sm font-caption text-muted-foreground">70-85%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-warning" />
          <span className="text-xs md:text-sm font-caption text-muted-foreground">85-100%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-error" />
          <span className="text-xs md:text-sm font-caption text-muted-foreground">&gt;100%</span>
        </div>
      </div>
    </div>
  );
};

export default CapacityHeatmap;