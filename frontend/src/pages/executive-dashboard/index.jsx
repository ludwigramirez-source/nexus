import React, { useState, useEffect } from 'react';
import { metricsService } from '../../services/metricsService';
import { userService } from '../../services/userService';
import socketService from '../../services/socketService';
import Sidebar from '../../components/ui/Sidebar';
import UserProfileHeader from '../../components/ui/UserProfileHeader';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricCard from './components/MetricCard';
import CapacityHeatmap from './components/CapacityHeatmap';
import RequestFunnel from './components/RequestFunnel';
import AlertsPanel from './components/AlertsPanel';
import TrendChart from './components/TrendChart';
import QuickFilters from './components/QuickFilters';
import { useNavigate } from 'react-router-dom';

const ExecutiveDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    dateRange: 'month',
    team: 'all',
    view: 'overview'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [heroMetrics, setHeroMetrics] = useState([]);
  const [weekCapacityData, setWeekCapacityData] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [capacityTrendData, setCapacityTrendData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUser(userData);

        const [metricsData, capacityData] = await Promise.all([
          metricsService.getDashboardMetrics(activeFilters),
          metricsService.getCapacityMetrics(activeFilters)
        ]);

        setHeroMetrics(metricsData.data?.heroMetrics || []);
        setFunnelData(metricsData.data?.funnelData || []);
        setAlerts(metricsData.data?.alerts || []);
        setTrendData(metricsData.data?.trendData || []);
        setCapacityTrendData(metricsData.data?.capacityTrendData || []);
        setWeekCapacityData(capacityData.data?.weekCapacity || []);
        setNotifications(metricsData.data?.notifications || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setHeroMetrics([]);
        setFunnelData([]);
        setAlerts([]);
        setTrendData([]);
        setCapacityTrendData([]);
        setWeekCapacityData([]);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    socketService.connect();

    const handleMetricUpdate = (data) => {
      if (data.type === 'heroMetrics') setHeroMetrics(data.metrics);
      if (data.type === 'capacity') setWeekCapacityData(data.capacity);
      if (data.type === 'alerts') setAlerts(data.alerts);
    };

    socketService.on('metrics:updated', handleMetricUpdate);

    return () => {
      socketService.off('metrics:updated', handleMetricUpdate);
    };
  }, [activeFilters]);

  const handleLogout = () => {
    navigate('/authentication-and-access-control');
  };

  const handleMetricClick = (metric) => {
    console.log('Metric clicked:', metric);
  };

  const handleCapacityCellClick = (member, day) => {
    console.log('Capacity cell clicked:', member?.name, day?.label);
  };

  const handleFunnelStageClick = (stage) => {
    console.log('Funnel stage clicked:', stage);
  };

  const handleAlertClick = (alert) => {
    console.log('Alert clicked:', alert);
  };

  const handleAlertDismiss = (alertId) => {
    console.log('Alert dismissed:', alertId);
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const handleExport = () => {
    console.log('Exporting dashboard data...');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleMarkAsRead = (notificationId) => {
    console.log('Mark notification as read:', notificationId);
  };

  const handleMarkAllAsRead = () => {
    console.log('Mark all notifications as read');
  };

  const handleClearAllNotifications = () => {
    console.log('Clear all notifications');
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <div className={`transition-smooth ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}`}>
        <header className="sticky top-0 z-40 bg-card border-b border-border shadow-elevation-1">
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 md:py-4">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="px-2 md:px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-xs md:text-sm font-caption font-semibold text-primary uppercase tracking-wider">
                  CEO
                </span>
              </div>
              <div className="hidden md:block h-6 w-px bg-border" />
              <div className="hidden md:block">
                <p className="text-xs font-caption text-muted-foreground">
                  Última actualización: {new Date()?.toLocaleString('es-MX', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClearAll={handleClearAllNotifications}
              />
              <UserProfileHeader user={currentUser} onLogout={handleLogout} />
            </div>
          </div>
        </header>

        <main className="px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
          <Breadcrumb />

          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
              Panel Ejecutivo
            </h1>
            <p className="text-sm md:text-base font-caption text-muted-foreground">
              Vista estratégica de operaciones y rendimiento empresarial
            </p>
          </div>

          <QuickFilters
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onExport={handleExport}
            onRefresh={handleRefresh}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {heroMetrics?.map((metric, index) => (
              <MetricCard
                key={index}
                {...metric}
                loading={isLoading}
                onClick={() => handleMetricClick(metric)}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="lg:col-span-2">
              <CapacityHeatmap
                weekData={weekCapacityData}
                onCellClick={handleCapacityCellClick}
              />
            </div>
            <div>
              <RequestFunnel
                funnelData={funnelData}
                onStageClick={handleFunnelStageClick}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <TrendChart
              title="Tendencia Producto vs Personalización"
              subtitle="Últimas 4 semanas"
              data={trendData}
              dataKeys={[
                { dataKey: 'product', name: 'Producto' },
                { dataKey: 'custom', name: 'Personalización' }
              ]}
              chartType="area"
              height={300}
            />
            <TrendChart
              title="Capacidad y MRR"
              subtitle="Evolución semanal"
              data={capacityTrendData}
              dataKeys={[
                { dataKey: 'capacity', name: 'Capacidad (%)' },
                { dataKey: 'mrr', name: 'MRR ($K)' }
              ]}
              chartType="line"
              height={300}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <AlertsPanel
              alerts={alerts}
              onAlertClick={handleAlertClick}
              onDismiss={handleAlertDismiss}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;