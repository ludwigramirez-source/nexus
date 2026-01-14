import React from 'react';
import Icon from '../../../components/AppIcon';

const RiskScoreGauge = ({ score, label }) => {
  const getScoreColor = (score) => {
    if (score >= 75) return 'text-error';
    if (score >= 50) return 'text-warning';
    if (score >= 25) return 'text-primary';
    return 'text-success';
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return 'Crítico';
    if (score >= 50) return 'Alto';
    if (score >= 25) return 'Medio';
    return 'Bajo';
  };

  const getScoreBgColor = (score) => {
    if (score >= 75) return 'bg-error';
    if (score >= 50) return 'bg-warning';
    if (score >= 25) return 'bg-primary';
    return 'bg-success';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
          {label || 'Score de Riesgo General'}
        </h3>
        <Icon name="Activity" size={20} className="text-muted-foreground md:w-6 md:h-6" />
      </div>

      <div className="flex flex-col items-center justify-center py-6 md:py-8">
        <div className="relative w-32 h-32 md:w-40 md:h-40">
          <svg className="transform -rotate-90 w-full h-full">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(score / 100) * 283} 283`}
              className={getScoreColor(score)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl md:text-4xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-xs md:text-sm text-muted-foreground">/ 100</span>
          </div>
        </div>

        <div className="mt-4 md:mt-6 text-center">
          <span className={`inline-block px-4 py-2 rounded-full text-sm md:text-base font-medium ${getScoreBgColor(score)} text-white`}>
            Riesgo {getScoreLabel(score)}
          </span>
        </div>

        <div className="mt-4 md:mt-6 w-full">
          <div className="flex justify-between text-xs md:text-sm text-muted-foreground mb-2">
            <span>Bajo</span>
            <span>Medio</span>
            <span>Alto</span>
            <span>Crítico</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden flex">
            <div className="flex-1 bg-success"></div>
            <div className="flex-1 bg-primary"></div>
            <div className="flex-1 bg-warning"></div>
            <div className="flex-1 bg-error"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskScoreGauge;