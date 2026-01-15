import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, subtitle, icon, color = 'primary', trend }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-5 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-${color}/10`}>
          <Icon name={icon} size={20} className={`text-${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-medium ${trend > 0 ? 'text-success' : 'text-error'}`}>
            <Icon name={trend > 0 ? 'TrendingUp' : 'TrendingDown'} size={14} />
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs md:text-sm font-caption text-muted-foreground mb-1">{title}</p>
        <p className="text-xl md:text-2xl font-heading font-bold text-foreground">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

const DashboardMetricsCards = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4 md:p-5 animate-pulse">
            <div className="h-10 bg-muted rounded mb-3"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="mb-6 space-y-6">
      {/* MRR por Moneda */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          MRR de Cotizaciones Convertidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* MRR USD */}
          <MetricCard
            title="MRR USD (EEUU)"
            value={formatCurrency(metrics.mrrUSD || 0, 'USD')}
            icon="DollarSign"
            color="success"
            subtitle="Cotizaciones en dólares"
          />

          {/* MRR COP */}
          <MetricCard
            title="MRR COP (Colombia)"
            value={formatCurrency(metrics.mrrCOP || 0, 'COP')}
            icon="DollarSign"
            color="info"
            subtitle="Cotizaciones en pesos"
          />

          {/* Total MRR Convertido */}
          <MetricCard
            title="Total MRR Convertido"
            value={formatCurrency(metrics.totalMRRConverted || 0, 'USD')}
            icon="TrendingUp"
            color="primary"
            subtitle={`TRM: ${new Intl.NumberFormat('es-ES').format(metrics.exchangeRate || 0)} (Actualizado: ${
              metrics.exchangeRateLastUpdated
                ? new Date(metrics.exchangeRateLastUpdated).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
                : 'N/A'
            })`}
          />
        </div>
      </div>

      {/* Métricas Generales */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Métricas Generales
          </h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <Icon name="DollarSign" size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">Todos los valores en USD</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Total Products */}
          <MetricCard
            title="Total Productos"
            value={metrics.totalProducts}
            icon="Package"
            color="primary"
            subtitle="Productos activos"
          />

          {/* Total Services */}
          <MetricCard
            title="Total Servicios"
            value={metrics.totalServices}
            icon="LayoutGrid"
            color="secondary"
            subtitle="Servicios activos"
          />

          {/* Product Revenue */}
          <MetricCard
            title="Facturación Productos"
            value={formatCurrency(metrics.monthlyProductRevenue, 'USD')}
            icon="TrendingUp"
            color="success"
            subtitle="Convertido a USD"
          />

          {/* Service Revenue */}
          <MetricCard
            title="Facturación Servicios"
            value={formatCurrency(metrics.monthlyServiceRevenue, 'USD')}
            icon="BarChart3"
            color="info"
            subtitle="Convertido a USD"
          />

          {/* Recurring MRR */}
          <MetricCard
            title="MRR Recurrente"
            value={formatCurrency(metrics.recurringMRR, 'USD')}
            icon="RefreshCw"
            color="primary"
            subtitle="Ingresos recurrentes (USD)"
          />

          {/* One-time MRR */}
          <MetricCard
            title="Pagos Únicos"
            value={formatCurrency(metrics.oneTimeMRR, 'USD')}
            icon="DollarSign"
            color="warning"
            subtitle="Ingresos no recurrentes (USD)"
          />

          {/* Total VAT */}
          <MetricCard
            title="IVA Total"
            value={formatCurrency(metrics.totalVAT, 'USD')}
            icon="FileText"
            color="muted"
            subtitle="Impuestos (USD)"
          />

          {/* Total Monthly Revenue */}
          <MetricCard
            title="Total Mensual"
            value={formatCurrency(metrics.totalMonthlyRevenue, 'USD')}
            icon="DollarSign"
            color="success"
            subtitle={`${metrics.activeClients} clientes activos`}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardMetricsCards;
