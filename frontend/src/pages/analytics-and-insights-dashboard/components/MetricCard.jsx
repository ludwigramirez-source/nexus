import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, change, changeType, icon, iconColor, trend }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1">
          <p className="text-xs md:text-sm font-caption text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground">
            {value}
          </p>
        </div>
        <div className={`p-2 md:p-3 rounded-lg ${iconColor}`}>
          <Icon name={icon} size={20} className="md:w-6 md:h-6" />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Icon name={getChangeIcon()} size={16} className={getChangeColor()} />
          <span className={`text-xs md:text-sm font-caption font-medium ${getChangeColor()}`}>
            {change}
          </span>
        </div>
        {trend && (
          <span className="text-xs font-caption text-muted-foreground">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;