import React, { useState, useEffect } from 'react';
import { okrService } from '../../services/okrService';
import socketService from '../../services/socketService';
import Sidebar from '../../components/ui/Sidebar';
import UserProfileHeader from '../../components/ui/UserProfileHeader';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import OKRCard from './components/OKRCard';
import RoadmapTimeline from './components/RoadmapTimeline';
import QuarterSummary from './components/QuarterSummary';
import FilterBar from './components/FilterBar';

const OKRsAndRoadmapManagement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('okrs');
  const [filters, setFilters] = useState({
    owner: 'all',
    department: 'all',
    status: 'all',
    priority: 'all'
  });

  const [okrs, setOkrs] = useState([]);
  const [roadmapFeatures, setRoadmapFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const okrsData = await okrService.getAll();
        setOkrs(okrsData.data || []);
        setRoadmapFeatures([]);
      } catch (error) {
        console.error('Error loading OKRs:', error);
        setOkrs([]);
        setRoadmapFeatures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socketService.connect();

    const handleOKRCreated = (newOKR) => {
      setOkrs((prev) => [newOKR, ...prev]);
    };

    const handleOKRUpdated = (updatedOKR) => {
      setOkrs((prev) => prev.map(o => o.id === updatedOKR.id ? updatedOKR : o));
    };

    socketService.on('okr:created', handleOKRCreated);
    socketService.on('okr:updated', handleOKRUpdated);

    return () => {
      socketService.off('okr:created', handleOKRCreated);
      socketService.off('okr:updated', handleOKRUpdated);
    };
  }, []);

  const quarters = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];
  const currentQuarter = 'Q1 2026';

  const calculateMetrics = () => {
    const activeOKRs = okrs?.filter(okr => okr?.quarter === currentQuarter)?.length;
    const averageProgress = Math.round(
      okrs?.reduce((sum, okr) => sum + okr?.progress, 0) / okrs?.length
    );
    const averageConfidence = Math.round(
      okrs?.reduce((sum, okr) => sum + okr?.confidence, 0) / okrs?.length
    );
    const plannedFeatures = roadmapFeatures?.filter(
      f => f?.quarter === currentQuarter
    )?.length;

    return {
      activeOKRs,
      averageProgress,
      averageConfidence,
      plannedFeatures
    };
  };

  const handleOKRUpdate = (id, updates) => {
    setOkrs(okrs?.map(okr => (okr?.id === id ? { ...okr, ...updates } : okr)));
  };

  const handleOKRDelete = (id) => {
    setOkrs(okrs?.filter(okr => okr?.id !== id));
  };

  const handleAddKeyResult = (okrId) => {
    const newKR = {
      id: `kr${Date.now()}`,
      description: 'Nuevo resultado clave',
      current: 0,
      target: 100,
      unit: 'unidades'
    };
    setOkrs(
      okrs?.map(okr =>
        okr?.id === okrId
          ? { ...okr, keyResults: [...okr?.keyResults, newKR] }
          : okr
      )
    );
  };

  const handleFeatureUpdate = (id, updates) => {
    setRoadmapFeatures(
      roadmapFeatures?.map(feature =>
        feature?.id === id ? { ...feature, ...updates } : feature
      )
    );
  };

  const handleFeatureDelete = (id) => {
    setRoadmapFeatures(roadmapFeatures?.filter(feature => feature?.id !== id));
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    setFilters({
      owner: 'all',
      department: 'all',
      status: 'all',
      priority: 'all'
    });
  };

  const handleExport = () => {
    const dataToExport = {
      okrs: okrs,
      roadmap: roadmapFeatures,
      metrics: calculateMetrics(),
      exportDate: new Date()?.toISOString()
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `okrs-roadmap-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddOKR = () => {
    const newOKR = {
      id: Date.now(),
      title: 'Nuevo objetivo estratégico',
      owner: 'Ludwig Schmidt',
      department: 'Producto',
      progress: 0,
      confidence: 50,
      quarter: currentQuarter,
      keyResults: []
    };
    setOkrs([...okrs, newOKR]);
  };

  const handleAddFeature = () => {
    const newFeature = {
      id: `f${Date.now()}`,
      title: 'Nueva característica',
      description: 'Descripción de la característica',
      product: 'Plataforma Principal',
      quarter: currentQuarter,
      status: 'planned',
      priority: 'medium',
      milestone: null,
      dependencies: []
    };
    setRoadmapFeatures([...roadmapFeatures, newFeature]);
  };

  const filteredOKRs = okrs?.filter(okr => {
    if (filters?.owner !== 'all' && okr?.owner !== filters?.owner) return false;
    if (filters?.department !== 'all' && okr?.department !== filters?.department)
      return false;
    return true;
  });

  const filteredFeatures = roadmapFeatures?.filter(feature => {
    if (filters?.priority !== 'all' && feature?.priority !== filters?.priority)
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'
        }`}
      >
        <header className="sticky top-0 z-40 bg-card border-b border-border shadow-elevation-1">
          <div className="px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
                  OKRs y Hoja de Ruta
                </h1>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <NotificationCenter />
                <UserProfileHeader />
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 md:px-6 lg:px-8 py-6">
          <Breadcrumb />

          <QuarterSummary
            currentQuarter={currentQuarter}
            metrics={calculateMetrics()}
          />

          <div className="bg-card border border-border rounded-lg mb-6">
            <div className="border-b border-border">
              <div className="flex items-center gap-1 p-1">
                <button
                  onClick={() => setActiveTab('okrs')}
                  className={`
                    flex-1 px-4 py-2.5 text-sm font-caption font-medium rounded-lg transition-all duration-200
                    ${
                      activeTab === 'okrs' ?'bg-primary text-primary-foreground shadow-elevation-1' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon name="Target" size={18} />
                    <span>OKRs</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className={`
                    flex-1 px-4 py-2.5 text-sm font-caption font-medium rounded-lg transition-all duration-200
                    ${
                      activeTab === 'roadmap' ?'bg-primary text-primary-foreground shadow-elevation-1' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon name="Map" size={18} />
                    <span>Hoja de Ruta</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onExport={handleExport}
          />

          {activeTab === 'okrs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-semibold text-foreground">
                  Objetivos y Resultados Clave ({filteredOKRs?.length})
                </h2>
                <Button
                  variant="default"
                  onClick={handleAddOKR}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={18}
                >
                  Nuevo OKR
                </Button>
              </div>
              {filteredOKRs?.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <Icon
                    name="Target"
                    size={48}
                    className="text-muted-foreground mx-auto mb-4"
                  />
                  <p className="text-base font-caption text-muted-foreground">
                    No hay OKRs que coincidan con los filtros seleccionados
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOKRs?.map(okr => (
                    <OKRCard
                      key={okr?.id}
                      okr={okr}
                      onUpdate={handleOKRUpdate}
                      onDelete={handleOKRDelete}
                      onAddKeyResult={handleAddKeyResult}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-semibold text-foreground">
                  Hoja de Ruta del Producto
                </h2>
                <Button
                  variant="default"
                  onClick={handleAddFeature}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={18}
                >
                  Nueva Característica
                </Button>
              </div>
              <RoadmapTimeline
                features={filteredFeatures}
                quarters={quarters}
                onFeatureUpdate={handleFeatureUpdate}
                onFeatureDelete={handleFeatureDelete}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OKRsAndRoadmapManagement;