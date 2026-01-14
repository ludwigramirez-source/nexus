import React from 'react';
import Icon from '../../../components/AppIcon';

const RequestFunnel = ({ funnelData, onStageClick }) => {
  const getStageIcon = (stage) => {
    const icons = {
      'Entrada': 'Inbox',
      'Evaluación': 'Search',
      'Planificado': 'Calendar',
      'En Progreso': 'Loader',
      'Completado': 'CheckCircle'
    };
    return icons?.[stage] || 'Circle';
  };

  const getStageColor = (stage) => {
    const colors = {
      'Entrada': 'text-muted-foreground',
      'Evaluación': 'text-primary',
      'Planificado': 'text-accent',
      'En Progreso': 'text-warning',
      'Completado': 'text-success'
    };
    return colors?.[stage] || 'text-muted-foreground';
  };

  const maxCount = Math.max(...funnelData?.map(stage => stage?.count));

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Embudo de Solicitudes
          </h3>
          <p className="text-xs md:text-sm font-caption text-muted-foreground mt-1">
            Flujo de trabajo actual
          </p>
        </div>
        <Icon name="Filter" size={20} className="text-muted-foreground md:w-6 md:h-6" />
      </div>
      <div className="space-y-3 md:space-y-4">
        {funnelData?.map((stage, index) => {
          const widthPercentage = (stage?.count / maxCount) * 100;
          const conversionRate = index > 0 
            ? ((stage?.count / funnelData?.[index - 1]?.count) * 100)?.toFixed(1)
            : null;

          return (
            <div key={index}>
              <button
                onClick={() => onStageClick && onStageClick(stage)}
                className="w-full text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Icon 
                      name={getStageIcon(stage?.stage)} 
                      size={16}
                      className={`${getStageColor(stage?.stage)} md:w-5 md:h-5`}
                    />
                    <span className="text-sm md:text-base font-caption font-medium text-foreground">
                      {stage?.stage}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <span className="text-lg md:text-xl font-heading font-bold text-foreground data-text">
                      {stage?.count}
                    </span>
                    {conversionRate && (
                      <span className="text-xs md:text-sm font-caption text-muted-foreground">
                        ({conversionRate}%)
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative h-8 md:h-10 bg-muted rounded-lg overflow-hidden">
                  <div
                    className={`
                      absolute inset-y-0 left-0 rounded-lg transition-all duration-500
                      ${stage?.stage === 'Completado' ? 'bg-success' : 
                        stage?.stage === 'En Progreso' ? 'bg-warning' :
                        stage?.stage === 'Planificado' ? 'bg-accent' :
                        stage?.stage === 'Evaluación'? 'bg-primary' : 'bg-muted-foreground'}
                      group-hover:opacity-80
                    `}
                    style={{ width: `${widthPercentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center px-3 md:px-4">
                    <span className="text-xs md:text-sm font-caption font-medium text-foreground mix-blend-difference">
                      {stage?.breakdown?.product} producto · {stage?.breakdown?.custom} personalización
                    </span>
                  </div>
                </div>
              </button>
              {index < funnelData?.length - 1 && (
                <div className="flex justify-center my-1 md:my-2">
                  <Icon name="ChevronDown" size={16} className="text-muted-foreground md:w-5 md:h-5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="text-center">
            <p className="text-xs md:text-sm font-caption text-muted-foreground mb-1">
              Tasa de Conversión
            </p>
            <p className="text-lg md:text-xl font-heading font-bold text-foreground data-text">
              {((funnelData?.[funnelData?.length - 1]?.count / funnelData?.[0]?.count) * 100)?.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs md:text-sm font-caption text-muted-foreground mb-1">
              Tiempo Promedio
            </p>
            <p className="text-lg md:text-xl font-heading font-bold text-foreground data-text">
              12.5 días
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestFunnel;