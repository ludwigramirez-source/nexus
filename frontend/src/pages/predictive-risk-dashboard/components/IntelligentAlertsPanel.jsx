import React from 'react';
import Icon from '../../../components/AppIcon';

const IntelligentAlertsPanel = ({ alerts, onAlertAction, onDismiss }) => {
  const getSeverityIcon = (severity) => {
    const icons = {
      critica: 'AlertCircle',
      alta: 'AlertTriangle',
      media: 'Info',
      baja: 'CheckCircle'
    };
    return icons?.[severity] || 'Info';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critica: 'border-error bg-error/10',
      alta: 'border-warning bg-warning/10',
      media: 'border-primary bg-primary/10',
      baja: 'border-success bg-success/10'
    };
    return colors?.[severity] || 'border-border bg-card';
  };

  const getIconColor = (severity) => {
    const colors = {
      critica: 'text-error',
      alta: 'text-warning',
      media: 'text-primary',
      baja: 'text-success'
    };
    return colors?.[severity] || 'text-muted-foreground';
  };

  const getTypeLabel = (tipo) => {
    const labels = {
      sobrecarga: 'Sobrecarga',
      cliente_riesgo: 'Cliente en Riesgo',
      okr: 'OKR',
      productizacion: 'Productización',
      general: 'General'
    };
    return labels?.[tipo] || 'General';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Alertas Inteligentes
          </h3>
          <p className="text-xs md:text-sm font-caption text-muted-foreground mt-1">
            Detectadas automáticamente por IA
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 rounded-full bg-error text-error-foreground text-xs md:text-sm font-caption font-medium">
            {alerts?.filter(a => a?.severidad === 'critica')?.length}
          </span>
          <Icon name="Sparkles" size={20} className="text-primary md:w-6 md:h-6" />
        </div>
      </div>

      <div className="space-y-3 md:space-y-4 max-h-[500px] md:max-h-[600px] overflow-y-auto">
        {alerts?.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <Icon name="CheckCircle" size={40} className="text-success mx-auto mb-3 md:w-12 md:h-12" />
            <p className="text-sm md:text-base font-caption text-muted-foreground">
              No hay alertas detectadas
            </p>
          </div>
        ) : (
          alerts?.map((alert, index) => (
            <div
              key={index}
              className={`border-l-4 rounded-lg p-3 md:p-4 transition-smooth ${getSeverityColor(alert?.severidad)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <Icon
                    name={getSeverityIcon(alert?.severidad)}
                    size={20}
                    className={`${getIconColor(alert?.severidad)} flex-shrink-0 mt-0.5 md:w-6 md:h-6`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm md:text-base font-caption font-semibold text-foreground">
                        {alert?.titulo}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-caption">
                        {getTypeLabel(alert?.tipo)}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm font-caption text-muted-foreground mb-2 md:mb-3">
                      {alert?.mensaje}
                    </p>
                    {alert?.metrica && (
                      <div className="mb-2">
                        <span className="text-xs font-caption font-medium text-foreground data-text">
                          📊 {alert?.metrica}
                        </span>
                      </div>
                    )}
                    {alert?.accionRecomendada && (
                      <div className="bg-background/50 rounded-lg p-2 md:p-3 mt-2">
                        <p className="text-xs md:text-sm font-caption text-foreground">
                          <span className="font-medium">Acción Recomendada:</span> {alert?.accionRecomendada}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1 md:space-x-2 ml-2 flex-shrink-0">
                  {onAlertAction && alert?.accionRecomendada && (
                    <button
                      onClick={() => onAlertAction(alert)}
                      className="p-1.5 md:p-2 rounded-lg hover:bg-muted transition-smooth"
                      title="Ejecutar acción"
                    >
                      <Icon name="Play" size={14} className="text-primary md:w-4 md:h-4" />
                    </button>
                  )}
                  {onDismiss && (
                    <button
                      onClick={() => onDismiss(index)}
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

export default IntelligentAlertsPanel;