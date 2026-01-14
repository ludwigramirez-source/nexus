import React from 'react';
import Icon from '../../../components/AppIcon';

const AlertsPanel = ({ alerts, onAlertClick, onDismiss }) => {
  const getAlertIcon = (severity) => {
    const icons = {
      critical: 'AlertCircle',
      warning: 'AlertTriangle',
      info: 'Info'
    };
    return icons?.[severity] || 'Info';
  };

  const getAlertColor = (severity) => {
    const colors = {
      critical: 'border-error bg-error/10',
      warning: 'border-warning bg-warning/10',
      info: 'border-primary bg-primary/10'
    };
    return colors?.[severity] || 'border-border bg-card';
  };

  const getIconColor = (severity) => {
    const colors = {
      critical: 'text-error',
      warning: 'text-warning',
      info: 'text-primary'
    };
    return colors?.[severity] || 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Alertas Ejecutivas
          </h3>
          <p className="text-xs md:text-sm font-caption text-muted-foreground mt-1">
            Requieren atención inmediata
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 rounded-full bg-error text-error-foreground text-xs md:text-sm font-caption font-medium">
            {alerts?.filter(a => a?.severity === 'critical')?.length}
          </span>
          <Icon name="Bell" size={20} className="text-muted-foreground md:w-6 md:h-6" />
        </div>
      </div>
      <div className="space-y-3 md:space-y-4 max-h-[400px] md:max-h-[500px] overflow-y-auto">
        {alerts?.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <Icon name="CheckCircle" size={40} className="text-success mx-auto mb-3 md:w-12 md:h-12" />
            <p className="text-sm md:text-base font-caption text-muted-foreground">
              No hay alertas pendientes
            </p>
          </div>
        ) : (
          alerts?.map((alert) => (
            <div
              key={alert?.id}
              className={`
                border-l-4 rounded-lg p-3 md:p-4 transition-smooth
                ${getAlertColor(alert?.severity)}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <Icon
                    name={getAlertIcon(alert?.severity)}
                    size={20}
                    className={`${getIconColor(alert?.severity)} flex-shrink-0 mt-0.5 md:w-6 md:h-6`}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm md:text-base font-caption font-semibold text-foreground mb-1">
                      {alert?.title}
                    </h4>
                    <p className="text-xs md:text-sm font-caption text-muted-foreground mb-2 md:mb-3">
                      {alert?.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                      <span className="text-xs font-caption text-muted-foreground">
                        {alert?.timestamp}
                      </span>
                      {alert?.affectedTeam && (
                        <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-caption">
                          {alert?.affectedTeam}
                        </span>
                      )}
                      {alert?.metric && (
                        <span className="text-xs font-caption font-medium text-foreground data-text">
                          {alert?.metric}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 md:space-x-2 ml-2 flex-shrink-0">
                  {onAlertClick && (
                    <button
                      onClick={() => onAlertClick(alert)}
                      className="p-1.5 md:p-2 rounded-lg hover:bg-muted transition-smooth"
                      title="Ver detalles"
                    >
                      <Icon name="ExternalLink" size={14} className="text-muted-foreground md:w-4 md:h-4" />
                    </button>
                  )}
                  {onDismiss && (
                    <button
                      onClick={() => onDismiss(alert?.id)}
                      className="p-1.5 md:p-2 rounded-lg hover:bg-muted transition-smooth"
                      title="Descartar"
                    >
                      <Icon name="X" size={14} className="text-muted-foreground md:w-4 md:h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;