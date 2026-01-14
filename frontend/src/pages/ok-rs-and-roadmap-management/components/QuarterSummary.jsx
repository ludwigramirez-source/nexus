import React from 'react';
import Icon from '../../../components/AppIcon';

const QuarterSummary = ({ currentQuarter, metrics }) => {
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-success';
    if (progress >= 50) return 'text-warning';
    return 'text-error';
  };

  const summaryCards = [
    {
      label: 'OKRs activos',
      value: metrics?.activeOKRs,
      icon: 'Target',
      color: 'text-primary'
    },
    {
      label: 'Progreso promedio',
      value: `${metrics?.averageProgress}%`,
      icon: 'TrendingUp',
      color: getProgressColor(metrics?.averageProgress)
    },
    {
      label: 'Características planeadas',
      value: metrics?.plannedFeatures,
      icon: 'Calendar',
      color: 'text-secondary'
    },
    {
      label: 'Confianza promedio',
      value: `${metrics?.averageConfidence}%`,
      icon: 'Activity',
      color: getProgressColor(metrics?.averageConfidence)
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
            {currentQuarter}
          </h2>
          <p className="text-sm font-caption text-muted-foreground mt-1">
            Resumen de objetivos y hoja de ruta
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <span className="text-sm font-caption text-foreground">
              07 Ene 2026
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {summaryCards?.map((card, index) => (
          <div
            key={index}
            className="bg-muted/50 rounded-lg p-3 md:p-4 transition-all duration-200 hover:shadow-elevation-1"
          >
            <div className="flex items-center justify-between mb-2">
              <Icon name={card?.icon} size={20} className={card?.color} />
            </div>
            <p className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-1">
              {card?.value}
            </p>
            <p className="text-xs md:text-sm font-caption text-muted-foreground">
              {card?.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuarterSummary;