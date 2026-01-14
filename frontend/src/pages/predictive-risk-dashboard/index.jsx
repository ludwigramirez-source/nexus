import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import UserProfileHeader from '../../components/ui/UserProfileHeader';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import RiskCategoryCard from './components/RiskCategoryCard';
import IntelligentAlertsPanel from './components/IntelligentAlertsPanel';
import RiskScoreGauge from './components/RiskScoreGauge';
import { detectOperationalRisks, generatePredictiveInsights } from '../../services/predictiveRiskService';
import { useNavigate } from 'react-router-dom';

const PredictiveRiskDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [predictiveInsights, setPredictiveInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('current');

  const currentUser = {
    name: "Ludwig Schmidt",
    role: "CEO",
    email: "ludwig@iptegra.com",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg"
  };

  const notifications = [
    {
      id: 1,
      type: "warning",
      title: "Riesgo Detectado",
      message: "Sobrecarga de equipo detectada automáticamente",
      timestamp: "2026-01-07T04:00:00",
      read: false
    }
  ];

  // Mock operational data - in production, this would come from your backend
  const operationalData = {
    capacityUtilization: 87,
    teamVelocity: 42,
    productCustomRatio: "65/35",
    mrr: "$485K",
    pendingRequests: 23,
    okrProgress: 68,
    teamMembers: [
      { name: "Carlos Mendoza", role: "Director", utilization: 95, velocity: 18 },
      { name: "Ana Rodríguez", role: "Developer", utilization: 102, velocity: 24 },
      { name: "Ludwig Schmidt", role: "CEO", utilization: 40, velocity: 8 }
    ]
  };

  const historicalData = [
    { period: "Sem 1", capacity: 82, velocity: 38, ratio: 68 },
    { period: "Sem 2", capacity: 85, velocity: 40, ratio: 62 },
    { period: "Sem 3", capacity: 88, velocity: 41, ratio: 70 },
    { period: "Sem 4", capacity: 87, velocity: 42, ratio: 65 }
  ];

  const handleAnalyzeRisks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await detectOperationalRisks(operationalData);
      setRiskAnalysis(result);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePredictions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generatePredictiveInsights(historicalData);
      setPredictiveInsights(result);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/authentication-and-access-control');
  };

  const handleAlertAction = (alert) => {
    console.log('Ejecutar acción para alerta:', alert);
  };

  const handleAlertDismiss = (alertIndex) => {
    console.log('Descartar alerta:', alertIndex);
  };

  const handleViewDetails = (category, data) => {
    console.log('Ver detalles de:', category, data);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-smooth ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'
        }`}
      >
        <header className="bg-card border-b border-border px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-muted rounded-lg transition-smooth lg:hidden"
            >
              <Icon name="Menu" size={20} />
            </button>
            <Breadcrumb
              customItems={[
                { label: 'Analíticas', path: '/analytics-and-insights-dashboard' },
                { label: 'Dashboard Predictivo', path: '/predictive-risk-dashboard' }
              ]}
            />
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <NotificationCenter 
              notifications={notifications}
              onMarkAsRead={(id) => console.log('Mark as read:', id)}
              onMarkAllAsRead={() => console.log('Mark all as read')}
              onClearAll={() => console.log('Clear all')}
            />
            <UserProfileHeader user={currentUser} onLogout={handleLogout} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                  Dashboard Predictivo de Riesgos
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Detección automática de riesgos operacionales con IA
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={activeView === 'current' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('current')}
                  iconName="Activity"
                >
                  Riesgos Actuales
                </Button>
                <Button
                  variant={activeView === 'predictive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('predictive')}
                  iconName="TrendingUp"
                >
                  Predicciones
                </Button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon name="AlertCircle" size={20} className="text-error mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-error mb-1">Error al analizar riesgos</p>
                    <p className="text-sm text-error/80">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Current Risks View */}
            {activeView === 'current' && (
              <>
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleAnalyzeRisks}
                    loading={loading}
                    iconName="Sparkles"
                    disabled={loading}
                  >
                    Analizar Riesgos con IA
                  </Button>
                  <Button
                    variant="outline"
                    iconName="RefreshCw"
                    disabled={loading}
                    onClick={handleAnalyzeRisks}
                  >
                    Actualizar
                  </Button>
                </div>

                {loading && (
                  <div className="flex flex-col items-center justify-center py-12 md:py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-sm md:text-base text-muted-foreground">Analizando riesgos operacionales con IA...</p>
                  </div>
                )}

                {!loading && riskAnalysis && (
                  <>
                    {/* Risk Score and Executive Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-1">
                        <RiskScoreGauge 
                          score={riskAnalysis?.scoreRiesgoGeneral || 0}
                          label="Score de Riesgo General"
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1 h-full">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Icon name="FileText" size={24} className="text-primary" />
                            </div>
                            <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
                              Resumen Ejecutivo
                            </h3>
                          </div>
                          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            {riskAnalysis?.resumenEjecutivo}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Risk Categories */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <RiskCategoryCard
                        category="sobrecarga"
                        data={riskAnalysis?.sobrecargaEquipo}
                        onViewDetails={handleViewDetails}
                      />
                      <RiskCategoryCard
                        category="cliente_riesgo"
                        data={riskAnalysis?.clientesEnRiesgo}
                        onViewDetails={handleViewDetails}
                      />
                      <RiskCategoryCard
                        category="okr"
                        data={riskAnalysis?.desviacionesOKR}
                        onViewDetails={handleViewDetails}
                      />
                      <RiskCategoryCard
                        category="productizacion"
                        data={riskAnalysis?.oportunidadesProductizacion}
                        onViewDetails={handleViewDetails}
                      />
                    </div>

                    {/* Intelligent Alerts */}
                    <IntelligentAlertsPanel
                      alerts={riskAnalysis?.alertasInteligentes || []}
                      onAlertAction={handleAlertAction}
                      onDismiss={handleAlertDismiss}
                    />
                  </>
                )}

                {!loading && !riskAnalysis && (
                  <div className="text-center py-12 md:py-16">
                    <Icon name="Sparkles" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-base md:text-lg text-muted-foreground mb-2">
                      Haz clic en "Analizar Riesgos con IA" para comenzar
                    </p>
                    <p className="text-sm text-muted-foreground">
                      La IA detectará automáticamente riesgos operacionales y generará alertas inteligentes
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Predictive View */}
            {activeView === 'predictive' && (
              <>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleGeneratePredictions}
                    loading={loading}
                    iconName="TrendingUp"
                    disabled={loading}
                  >
                    Generar Predicciones
                  </Button>
                </div>

                {loading && (
                  <div className="flex flex-col items-center justify-center py-12 md:py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-sm md:text-base text-muted-foreground">Generando predicciones con IA...</p>
                  </div>
                )}

                {!loading && predictiveInsights && (
                  <div className="space-y-6">
                    {/* Trends */}
                    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1">
                      <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="TrendingUp" size={20} />
                        Tendencias Identificadas
                      </h3>
                      <div className="space-y-2">
                        {predictiveInsights?.tendencias?.map((trend, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Icon name="ArrowRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm md:text-base text-foreground">{trend}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Predictions */}
                    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1">
                      <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="Eye" size={20} />
                        Predicciones (Próximas 2-4 Semanas)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {predictiveInsights?.predicciones?.map((pred, idx) => (
                          <div key={idx} className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-foreground">{pred?.categoria}</span>
                              <div className="flex gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  pred?.probabilidad === 'alta' ? 'bg-error/10 text-error' :
                                  pred?.probabilidad === 'media'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                                }`}>
                                  {pred?.probabilidad}
                                </span>
                                {pred?.impacto && (
                                  <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                                    Impacto: {pred?.impacto}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{pred?.prediccion}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preventive Recommendations */}
                    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1">
                      <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="Shield" size={20} />
                        Recomendaciones Preventivas
                      </h3>
                      <div className="space-y-3">
                        {predictiveInsights?.recomendacionesPreventivas?.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                            <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                            <span className="text-sm md:text-base text-foreground">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!loading && !predictiveInsights && (
                  <div className="text-center py-12 md:py-16">
                    <Icon name="TrendingUp" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-base md:text-lg text-muted-foreground mb-2">
                      Haz clic en "Generar Predicciones" para comenzar
                    </p>
                    <p className="text-sm text-muted-foreground">
                      La IA analizará tendencias históricas y predecirá riesgos futuros
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PredictiveRiskDashboard;