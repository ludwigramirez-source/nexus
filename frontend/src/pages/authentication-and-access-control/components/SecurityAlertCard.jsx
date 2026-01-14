import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecurityAlertCard = ({ alert, onDismiss, onViewDetails }) => {
  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-error/10',
          border: 'border-error',
          text: 'text-error',
          icon: 'AlertOctagon',
          label: 'Crítico'
        };
      case 'high':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning',
          text: 'text-warning',
          icon: 'AlertTriangle',
          label: 'Alto'
        };
      case 'medium':
        return {
          bg: 'bg-accent/10',
          border: 'border-accent',
          text: 'text-accent',
          icon: 'AlertCircle',
          label: 'Medio'
        };
      default:
        return {
          bg: 'bg-primary/10',
          border: 'border-primary',
          text: 'text-primary',
          icon: 'Info',
          label: 'Bajo'
        };
    }
  };

  const config = getSeverityConfig(alert?.severity);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`
      p-4 md:p-5 rounded-lg border-2 transition-smooth
      ${config?.bg} ${config?.border}
    `}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${config?.bg}`}>
            <Icon name={config?.icon} size={24} className={config?.text} />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm md:text-base font-caption font-semibold text-foreground">
                {alert?.title}
              </h3>
              <span className={`
                px-2 py-0.5 text-xs font-caption font-medium rounded-full
                ${config?.text} ${config?.bg}
              `}>
                {config?.label}
              </span>
            </div>
            <p className="text-xs md:text-sm font-caption text-muted-foreground">
              {formatDate(alert?.timestamp)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          onClick={() => onDismiss(alert?.id)}
        />
      </div>
      <p className="text-sm md:text-base font-caption text-foreground mb-4 pl-0 md:pl-14">
        {alert?.description}
      </p>
      {alert?.details && (
        <div className="pl-0 md:pl-14 space-y-2 mb-4">
          {alert?.details?.map((detail, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Icon name="ChevronRight" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs md:text-sm font-caption text-muted-foreground">
                {detail}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center space-x-2 pl-0 md:pl-14">
        <Button
          variant="outline"
          size="sm"
          iconName="Eye"
          onClick={() => onViewDetails(alert)}
        >
          Ver Detalles
        </Button>
        {alert?.actionRequired && (
          <Button
            variant="default"
            size="sm"
            iconName="Shield"
          >
            Tomar Acción
          </Button>
        )}
      </div>
    </div>
  );
};

export default SecurityAlertCard;