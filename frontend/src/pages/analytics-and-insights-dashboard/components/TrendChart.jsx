import React from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendChart = ({ title, data, type = 'line', dataKeys, colors, height = 300 }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-caption font-medium text-popover-foreground mb-2">
            {label}
          </p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <span className="text-xs font-caption text-muted-foreground">
                {entry?.name}:
              </span>
              <span className="text-xs font-caption font-medium" style={{ color: entry?.color }}>
                {entry?.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 20, left: 0, bottom: 5 }
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              {dataKeys?.map((key, index) => (
                <linearGradient key={key?.key} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors?.[index]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors?.[index]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {dataKeys?.map((key, index) => (
              <Area
                key={key?.key}
                type="monotone"
                dataKey={key?.key}
                name={key?.name}
                stroke={colors?.[index]}
                fillOpacity={1}
                fill={`url(#color${index})`}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {dataKeys?.map((key, index) => (
              <Bar key={key?.key} dataKey={key?.key} name={key?.name} fill={colors?.[index]} />
            ))}
          </BarChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {dataKeys?.map((key, index) => (
              <Line
                key={key?.key}
                type="monotone"
                dataKey={key?.key}
                name={key?.name}
                stroke={colors?.[index]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1">
      <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4">
        {title}
      </h3>
      <div className="w-full" style={{ height: `${height}px` }} aria-label={title}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;