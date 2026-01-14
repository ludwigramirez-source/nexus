import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const TrendChart = ({ title, subtitle, data, dataKeys, chartType = 'line', height = 300 }) => {
  const colors = {
    product: '#16a34a',
    custom: '#d97706',
    ratio: '#2563eb',
    capacity: '#8b5cf6',
    mrr: '#059669'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-caption font-medium text-popover-foreground mb-2">
            {label}
          </p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4 mb-1">
              <span className="text-xs font-caption text-muted-foreground">
                {entry?.name}:
              </span>
              <span className="text-sm font-caption font-semibold data-text" style={{ color: entry?.color }}>
                {entry?.value}
                {entry?.dataKey?.includes('ratio') || entry?.dataKey?.includes('capacity') ? '%' : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs md:text-sm font-caption text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <Icon name="TrendingUp" size={20} className="text-muted-foreground md:w-6 md:h-6" />
      </div>
      <ResponsiveContainer width="100%" height={height}>
        {chartType === 'area' ? (
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="period" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
            />
            {dataKeys?.map((key, index) => (
              <Area
                key={key?.dataKey}
                type="monotone"
                dataKey={key?.dataKey}
                name={key?.name}
                stroke={colors?.[key?.dataKey] || '#2563eb'}
                fill={colors?.[key?.dataKey] || '#2563eb'}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="period" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
            />
            {dataKeys?.map((key, index) => (
              <Line
                key={key?.dataKey}
                type="monotone"
                dataKey={key?.dataKey}
                name={key?.name}
                stroke={colors?.[key?.dataKey] || '#2563eb'}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;