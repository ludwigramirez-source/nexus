import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon, 
  iconColor = 'text-primary',
  onClick,
  loading = false 
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div 
      onClick={onClick}
      className={`
        bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1 
        transition-smooth hover:shadow-elevation-2
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm font-caption text-muted-foreground uppercase tracking-wider mb-1">
            {title}
          </p>
          {loading ? (
            <div className="h-8 md:h-10 bg-muted animate-pulse rounded w-24 md:w-32" />
          ) : (
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground data-text">
              {value}
            </h3>
          )}
        </div>
        {icon && (
          <div className={`p-2 md:p-3 rounded-lg bg-muted/50 ${iconColor}`}>
            <Icon name={icon} size={20} className="md:w-6 md:h-6" />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        {subtitle && (
          <p className="text-xs md:text-sm font-caption text-muted-foreground">
            {subtitle}
          </p>
        )}
        {trendValue && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={14} className="md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-caption font-medium data-text">
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;