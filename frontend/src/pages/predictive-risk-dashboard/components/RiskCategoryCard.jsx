import React from 'react';
import Icon from '../../../components/AppIcon';

const RiskCategoryCard = ({ category, data, onViewDetails }) => {
  const getSeverityColor = (severity) => {
    const colors = {
      critica: 'border-error bg-error/10 text-error',
      alta: 'border-warning bg-warning/10 text-warning',
      media: 'border-primary bg-primary/10 text-primary',
      baja: 'border-success bg-success/10 text-success',
      ninguna: 'border-muted bg-muted/10 text-muted-foreground'
    };
    return colors?.[severity] || colors?.ninguna;
  };

  const getCategoryIcon = (type) => {
    const icons = {
      sobrecarga: 'AlertCircle',
      cliente_riesgo: 'Users',
      okr: 'Target',
      productizacion: 'Lightbulb',
      general: 'Info'
    };
    return icons?.[type] || 'Info';
  };

  const getCategoryTitle = (type) => {
    const titles = {
      sobrecarga: 'Sobrecarga de Equipo',
      cliente_riesgo: 'Clientes en Riesgo',
      okr: 'Desviaciones de OKRs',
      productizacion: 'Oportunidades de Productización'
    };
    return titles?.[type] || 'Análisis General';
  };

  return (
    <div className={`border-l-4 rounded-lg p-4 md:p-6 transition-smooth ${getSeverityColor(data?.severidad || data?.potencial)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-background/50">
            <Icon name={getCategoryIcon(category)} size={24} className="md:w-7 md:h-7" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-heading font-semibold">
              {getCategoryTitle(category)}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {data?.detectado ? 'Riesgo Detectado' : 'Sin Riesgos'}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getSeverityColor(data?.severidad || data?.potencial)}`}>
          {data?.severidad || data?.potencial || 'N/A'}
        </span>
      </div>

      {data?.descripcion && (
        <p className="text-sm md:text-base text-foreground mb-4">
          {data?.descripcion}
        </p>
      )}

      {data?.miembrosAfectados && data?.miembrosAfectados?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Miembros Afectados:</p>
          <div className="flex flex-wrap gap-2">
            {data?.miembrosAfectados?.map((member, idx) => (
              <span key={idx} className="px-2 py-1 rounded-full bg-muted text-xs md:text-sm">
                {member}
              </span>
            ))}
          </div>
        </div>
      )}

      {data?.clientesIdentificados && data?.clientesIdentificados?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Clientes Identificados:</p>
          <div className="flex flex-wrap gap-2">
            {data?.clientesIdentificados?.map((client, idx) => (
              <span key={idx} className="px-2 py-1 rounded-full bg-muted text-xs md:text-sm">
                {client}
              </span>
            ))}
          </div>
        </div>
      )}

      {data?.objetivosAfectados && data?.objetivosAfectados?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Objetivos Afectados:</p>
          <div className="flex flex-wrap gap-2">
            {data?.objetivosAfectados?.map((obj, idx) => (
              <span key={idx} className="px-2 py-1 rounded-full bg-muted text-xs md:text-sm">
                {obj}
              </span>
            ))}
          </div>
        </div>
      )}

      {data?.patronesIdentificados && data?.patronesIdentificados?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Patrones Identificados:</p>
          <div className="space-y-1">
            {data?.patronesIdentificados?.map((pattern, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                <span className="text-xs md:text-sm text-foreground">{pattern}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.recomendaciones && data?.recomendaciones?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Recomendaciones:</p>
          <div className="space-y-2">
            {data?.recomendaciones?.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Icon name="ArrowRight" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-xs md:text-sm text-foreground">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {onViewDetails && (
        <button
          onClick={() => onViewDetails(category, data)}
          className="mt-4 text-xs md:text-sm font-medium text-primary hover:underline flex items-center gap-1"
        >
          Ver Detalles Completos
          <Icon name="ExternalLink" size={14} />
        </button>
      )}
    </div>
  );
};

export default RiskCategoryCard;