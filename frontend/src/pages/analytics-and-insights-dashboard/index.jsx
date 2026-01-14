import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { metricsService } from '../../services/metricsService';
import { clientService } from '../../services/clientService';
import socketService from '../../services/socketService';
import Sidebar from '../../components/ui/Sidebar';
import UserProfileHeader from '../../components/ui/UserProfileHeader';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';

import MetricCard from './components/MetricCard';
import TrendChart from './components/TrendChart';
import FilterPanel from './components/FilterPanel';
import TeamPerformanceTable from './components/TeamPerformanceTable';
import InsightCard from './components/InsightCard';
import ClientSegmentationMatrix from './components/ClientSegmentationMatrix';
import ExportPanel from './components/ExportPanel';
import AIInsightsPanel from './components/AIInsightsPanel';

const AnalyticsAndInsightsDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [lastUpdated] = useState(new Date()?.toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));
  const [loading, setLoading] = useState(true);
  const [keyMetrics, setKeyMetrics] = useState([]);
  const [productCustomRatioData, setProductCustomRatioData] = useState([]);
  const [teamVelocityData, setTeamVelocityData] = useState([]);
  const [financialImpactData, setFinancialImpactData] = useState([]);
  const [teamPerformanceData, setTeamPerformanceData] = useState([]);
  const [clientSegmentationData, setClientSegmentationData] = useState([]);
  const [automatedInsights, setAutomatedInsights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          metricsData,
          ratioData,
          performanceData,
          financialData,
          insightsData
        ] = await Promise.all([
          metricsService.getDashboardMetrics(),
          metricsService.getProductCustomRatio({ period: '6months' }),
          metricsService.getTeamPerformance({ period: '6weeks' }),
          metricsService.getFinancialMetrics({ period: '4quarters' }),
          metricsService.getAIInsights()
        ]);

        setKeyMetrics(metricsData.data?.keyMetrics || []);
        setProductCustomRatioData(ratioData.data?.trends || []);
        setTeamVelocityData(performanceData.data?.velocity || []);
        setFinancialImpactData(financialData.data?.trends || []);
        setTeamPerformanceData(performanceData.data?.members || []);
        setClientSegmentationData(metricsData.data?.clientSegmentation || []);
        setAutomatedInsights(insightsData.data?.insights || []);
      } catch (error) {
        console.error('Error loading analytics data:', error);
        setKeyMetrics([]);
        setProductCustomRatioData([]);
        setTeamVelocityData([]);
        setFinancialImpactData([]);
        setTeamPerformanceData([]);
        setClientSegmentationData([]);
        setAutomatedInsights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socketService.connect();

    const handleMetricUpdate = (data) => {
      if (data.type === 'keyMetrics') setKeyMetrics(data.metrics);
      if (data.type === 'insights') setAutomatedInsights(data.insights);
    };

    socketService.on('analytics:updated', handleMetricUpdate);

    return () => {
      socketService.off('analytics:updated', handleMetricUpdate);
    };
  }, []);


  const handleApplyFilters = (filters) => {
    console.log("Aplicando filtros:", filters);
  };

  const handleResetFilters = () => {
    console.log("Restableciendo filtros");
  };

  const handleExport = (config) => {
    console.log("Exportando datos con configuración:", config);
    alert(`Exportando datos en formato ${config?.format?.toUpperCase()}...`);
  };

  const handleLogout = () => {
    console.log("Cerrando sesión...");
  };

  const mockUser = JSON.parse(localStorage.getItem('user') || '{"name": "Usuario", "email": "usuario@iptegra.com"}');

  const handleMarkAsRead = (id) => {
    console.log("Marcar como leído:", id);
  };

  const handleMarkAllAsRead = () => {
    console.log("Marcar todas como leídas");
  };

  const handleClearAll = () => {
    console.log("Limpiar todas las notificaciones");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Helmet>
        <title>Analítica e Insights - IPTEGRA</title>
      </Helmet>
      <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: isSidebarCollapsed ? '64px' : '240px' }}
      >
        <UserProfileHeader user={mockUser} onLogout={handleLogout} />
        <NotificationCenter onMarkAsRead={handleMarkAsRead} onMarkAllAsRead={handleMarkAllAsRead} onClearAll={handleClearAll} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 space-y-6">
            <Breadcrumb 
              items={[
                { label: 'Inicio', href: '/' },
                { label: 'Analítica e Insights' }
              ]}
              customItems={[]} 
            />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                  Analítica e Insights
                </h1>
                <p className="text-sm text-muted-foreground">
                  Última actualización: {lastUpdated}
                </p>
              </div>
            </div>

            <FilterPanel onApplyFilters={handleApplyFilters} onResetFilters={handleResetFilters} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {keyMetrics?.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>

            <AIInsightsPanel 
              analyticsData={{
                productCustomRatio: '68/32',
                teamVelocity: 42,
                capacityUtilization: 87,
                customizationDebt: '$45,200'
              }}
              teamData={teamPerformanceData}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="xl:col-span-2 space-y-4 md:space-y-6">
                <TrendChart
                  title="Evolución Ratio Producto/Personalización"
                  data={productCustomRatioData}
                  type="area"
                  dataKeys={[
                  { key: 'producto', name: 'Producto' },
                  { key: 'personalización', name: 'Personalización' }]
                  }
                  colors={['#16a34a', '#d97706']}
                  height={300} />

                <TrendChart
                  title="Velocidad vs Capacidad del Equipo"
                  data={teamVelocityData}
                  type="line"
                  dataKeys={[
                  { key: 'velocidad', name: 'Velocidad Real' },
                  { key: 'capacidad', name: 'Capacidad Total' }]
                  }
                  colors={['#2563eb', '#94a3b8']}
                  height={300} />
              </div>

              <div className="xl:col-span-1">
                <ExportPanel onExport={handleExport} />
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <TrendChart
                title="Impacto Financiero - MRR vs Costo de Personalización"
                data={financialImpactData}
                type="bar"
                dataKeys={[
                { key: 'mrr', name: 'MRR Total' },
                { key: 'costoPersonalización', name: 'Costo Personalización' }]
                }
                colors={['#16a34a', '#dc2626']}
                height={300} />
            </div>

            <div className="mb-6 md:mb-8">
              <ClientSegmentationMatrix data={clientSegmentationData} />
            </div>

            <div className="mb-6 md:mb-8">
              <TeamPerformanceTable data={teamPerformanceData} />
            </div>

            <div className="mb-6 md:mb-8">
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <Icon name="Sparkles" size={24} className="text-primary" />
                <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground">
                  Insights Automatizados
                </h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {automatedInsights?.map((insight, index) =>
                <InsightCard
                  key={index}
                  {...insight}
                  onAction={() => console.log(`Ver detalles de insight ${index + 1}`)} />

                )}
              </div>
            </div>

            <div className="bg-muted/30 border border-border rounded-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={20} className="text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-caption font-medium text-foreground mb-1">
                      Datos en Tiempo Real
                    </p>
                    <p className="text-xs md:text-sm font-caption text-muted-foreground">
                      Los datos se actualizan automáticamente cada 5 minutos. Última sincronización: {lastUpdated}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-xs font-caption text-success font-medium">
                    Conectado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsAndInsightsDashboard;