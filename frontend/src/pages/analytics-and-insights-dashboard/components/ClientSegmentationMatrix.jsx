import React from 'react';
import Icon from '../../../components/AppIcon';

const ClientSegmentationMatrix = ({ data }) => {
  const getSegmentColor = (segment) => {
    const colors = {
      'high-value': 'bg-success/20 border-success text-success',
      'growth': 'bg-primary/20 border-primary text-primary',
      'at-risk': 'bg-warning/20 border-warning text-warning',
      'low-engagement': 'bg-error/20 border-error text-error'
    };
    return colors?.[segment] || 'bg-muted/20 border-muted text-muted-foreground';
  };

  const getSegmentIcon = (segment) => {
    const icons = {
      'high-value': 'TrendingUp',
      'growth': 'Target',
      'at-risk': 'AlertTriangle',
      'low-engagement': 'TrendingDown'
    };
    return icons?.[segment] || 'Circle';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
          Matriz de Segmentación de Clientes
        </h3>
        <Icon name="Grid3x3" size={20} className="text-muted-foreground" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.map((segment) => (
          <div
            key={segment?.id}
            className={`border-2 rounded-lg p-4 transition-smooth hover:shadow-elevation-2 ${getSegmentColor(segment?.segment)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon name={getSegmentIcon(segment?.segment)} size={20} />
                <h4 className="text-sm md:text-base font-heading font-semibold">
                  {segment?.name}
                </h4>
              </div>
              <span className="text-xl md:text-2xl font-heading font-bold">
                {segment?.count}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs md:text-sm font-caption">
                <span className="opacity-80">MRR Promedio:</span>
                <span className="font-medium">${segment?.avgMRR?.toLocaleString('es-MX')}</span>
              </div>
              <div className="flex items-center justify-between text-xs md:text-sm font-caption">
                <span className="opacity-80">Salud:</span>
                <span className="font-medium">{segment?.healthScore}%</span>
              </div>
              <div className="flex items-center justify-between text-xs md:text-sm font-caption">
                <span className="opacity-80">Personalización:</span>
                <span className="font-medium">{segment?.customizationRate}%</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-current opacity-50">
              <p className="text-xs font-caption">
                {segment?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientSegmentationMatrix;