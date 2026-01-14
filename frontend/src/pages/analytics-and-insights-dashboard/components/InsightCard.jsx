import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InsightCard = ({ type, title, description, recommendation, priority, onAction }) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'opportunity':
        return {
          icon: 'Lightbulb',
          iconColor: 'bg-success/10 text-success',
          borderColor: 'border-l-success'
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          iconColor: 'bg-warning/10 text-warning',
          borderColor: 'border-l-warning'
        };
      case 'critical':
        return {
          icon: 'AlertCircle',
          iconColor: 'bg-error/10 text-error',
          borderColor: 'border-l-error'
        };
      default:
        return {
          icon: 'Info',
          iconColor: 'bg-primary/10 text-primary',
          borderColor: 'border-l-primary'
        };
    }
  };

  const config = getTypeConfig();

  const getPriorityBadge = () => {
    const badges = {
      high: { label: 'Alta', className: 'bg-error/10 text-error' },
      medium: { label: 'Media', className: 'bg-warning/10 text-warning' },
      low: { label: 'Baja', className: 'bg-success/10 text-success' }
    };
    const badge = badges?.[priority] || badges?.medium;
    return (
      <span className={`px-2 py-1 rounded text-xs font-caption font-medium ${badge?.className}`}>
        {badge?.label}
      </span>
    );
  };

  return (
    <div className={`bg-card border border-border border-l-4 ${config?.borderColor} rounded-lg p-4 md:p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth`}>
      <div className="flex items-start space-x-4">
        <div className={`p-2 md:p-3 rounded-lg ${config?.iconColor} flex-shrink-0`}>
          <Icon name={config?.icon} size={20} className="md:w-6 md:h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm md:text-base font-heading font-semibold text-foreground">
              {title}
            </h4>
            {getPriorityBadge()}
          </div>
          
          <p className="text-sm font-caption text-muted-foreground mb-3">
            {description}
          </p>
          
          {recommendation && (
            <div className="bg-muted/50 rounded-lg p-3 mb-3">
              <p className="text-xs md:text-sm font-caption text-foreground">
                <span className="font-medium">Recomendación:</span> {recommendation}
              </p>
            </div>
          )}
          
          {onAction && (
            <Button
              variant="outline"
              size="sm"
              iconName="ArrowRight"
              iconPosition="right"
              onClick={onAction}
              className="mt-2"
            >
              Ver detalles
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightCard;