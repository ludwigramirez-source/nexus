import React, { useState, useEffect } from 'react';
import { okrService } from '../../services/okrService';
import { roadmapService } from '../../services/roadmapService';
import api from '../../services/api';
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
import AddKeyResultModal from './components/AddKeyResultModal';
import AddOKRModal from './components/AddOKRModal';

const OKRsAndRoadmapManagement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('okrs');
  const [filters, setFilters] = useState({
    owner: 'all',
    quarter: 'all',
    status: 'all',
    priority: 'all'
  });

  const [okrs, setOkrs] = useState([]);
  const [roadmapFeatures, setRoadmapFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddKRModalOpen, setIsAddKRModalOpen] = useState(false);
  const [selectedOKR, setSelectedOKR] = useState(null);
  const [isAddOKRModalOpen, setIsAddOKRModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Load OKRs from database
        const okrsData = await okrService.getAll();
        setOkrs(okrsData.data || []);

        // Load Roadmap items from database and transform to frontend format
        const roadmapData = await roadmapService.getAll();
        console.log('📦 Raw roadmap data from API:', roadmapData);

        const transformedFeatures = (roadmapData.data || []).map(feature => ({
          ...feature,
          // Transform status from backend UPPERCASE to frontend lowercase
          status: feature.status ? feature.status.toLowerCase().replace('_', '-') : 'planned',
          // Transform priority (backend doesn't have LOW, so default to medium)
          priority: feature.priority ? feature.priority.toLowerCase() : 'medium',
          // Map quarter to expected format
          quarter: feature.quarter || feature.targetQuarter || 'Q1 2026'
        }));

        console.log('✨ Transformed roadmap features:', transformedFeatures);
        setRoadmapFeatures(transformedFeatures);
      } catch (error) {
        console.error('Error loading data:', error);
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
    // Filter OKRs matching current quarter (format: "Q1 2026")
    const [quarter, year] = currentQuarter.split(' ');
    const activeOKRs = okrs?.filter(okr =>
      okr?.quarter === quarter && okr?.year === parseInt(year)
    )?.length || 0;

    // Calculate average progress (handle division by zero)
    const averageProgress = okrs?.length > 0
      ? Math.round(okrs.reduce((sum, okr) => sum + (okr?.progress || 0), 0) / okrs.length)
      : 0;

    // Calculate average confidence (handle division by zero)
    const averageConfidence = okrs?.length > 0
      ? Math.round(okrs.reduce((sum, okr) => sum + (okr?.confidence || 0), 0) / okrs.length)
      : 0;

    // Count planned features for current quarter
    const plannedFeatures = roadmapFeatures?.filter(
      f => f?.quarter === currentQuarter
    )?.length || 0;

    return {
      activeOKRs,
      averageProgress,
      averageConfidence,
      plannedFeatures
    };
  };

  const handleOKRUpdate = async (id, updates) => {
    try {
      const response = await okrService.update(id, updates);
      setOkrs(okrs?.map(okr => (okr?.id === id ? response.data : okr)));
    } catch (error) {
      console.error('Error updating OKR:', error);
      alert('Error al actualizar el OKR');
    }
  };

  const handleOKRDelete = async (id) => {
    try {
      await okrService.delete(id);
      setOkrs(okrs?.filter(okr => okr?.id !== id));
    } catch (error) {
      console.error('Error deleting OKR:', error);
      alert('Error al eliminar el OKR');
    }
  };

  const handleAddKeyResult = (okrId) => {
    const okr = okrs.find(o => o.id === okrId);
    if (okr) {
      setSelectedOKR(okr);
      setIsAddKRModalOpen(true);
    }
  };

  const handleSubmitKeyResult = async (krData) => {
    try {
      if (!selectedOKR) return;

      const response = await okrService.createKeyResult(selectedOKR.id, krData);
      console.log('✅ Key Result created successfully:', response);

      // Reload the specific OKR to get updated keyResults
      const updatedOKR = await okrService.getById(selectedOKR.id);
      setOkrs(okrs?.map(okr => okr?.id === selectedOKR.id ? updatedOKR.data : okr));

      setIsAddKRModalOpen(false);
      setSelectedOKR(null);
    } catch (error) {
      console.error('❌ Error adding key result:', error);
      alert('Error al agregar resultado clave: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleKeyResultProgressUpdate = async (okrId, krId, currentValue) => {
    try {
      // Update the progress using the specific endpoint
      await okrService.updateKeyResultProgress(okrId, krId, currentValue);

      // Reload the specific OKR to get the recalculated progress
      const updatedOKR = await okrService.getById(okrId);
      setOkrs(okrs?.map(okr => okr?.id === okrId ? updatedOKR.data : okr));
    } catch (error) {
      console.error('❌ Error updating key result progress:', error);
      alert('Error al actualizar el progreso: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleFeatureUpdate = async (id, updates) => {
    try {
      const feature = roadmapFeatures.find(f => f.id === id);
      if (!feature) {
        console.error('Feature not found:', id);
        return;
      }

      console.log('Updating feature:', { id, updates, feature });

      // Transform data to match backend expectations - only include changed fields
      const backendUpdates = {};

      // Map status from frontend lowercase to backend UPPERCASE
      if (updates.status !== undefined && updates.status !== null) {
        const statusMap = {
          'planned': 'PLANNED',
          'in-progress': 'IN_PROGRESS',
          'completed': 'DONE',
          'done': 'DONE'
        };
        backendUpdates.status = statusMap[updates.status] || updates.status.toUpperCase();
      }

      // Skip priority for now since backend doesn't use it currently
      // Map quarter to targetQuarter if present
      if (updates.quarter !== undefined && updates.quarter !== null) {
        backendUpdates.targetQuarter = updates.quarter;
      }

      // Add other fields directly - ensure they're not undefined/null
      if (updates.title !== undefined && updates.title !== null) {
        backendUpdates.title = String(updates.title);
      }

      if (updates.description !== undefined) {
        backendUpdates.description = updates.description === null ? '' : String(updates.description);
      }

      console.log('Backend updates:', backendUpdates);

      // Only send if there are fields to update
      if (Object.keys(backendUpdates).length === 0) {
        console.warn('No fields to update');
        return;
      }

      await roadmapService.update(feature.productId, id, backendUpdates);

      // Update local state
      setRoadmapFeatures(
        roadmapFeatures?.map(f => f?.id === id ? { ...f, ...updates } : f)
      );

      console.log('✅ Feature updated successfully');
    } catch (error) {
      console.error('❌ Error updating roadmap feature:', error);

      // Only show alert if it's a real error (not a Chrome extension error)
      if (error.response || error.request) {
        alert('Error al actualizar la característica: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleFeatureDelete = async (id) => {
    try {
      const feature = roadmapFeatures.find(f => f.id === id);
      if (!feature) return;

      await roadmapService.delete(feature.productId, id);
      setRoadmapFeatures(roadmapFeatures?.filter(f => f?.id !== id));
    } catch (error) {
      console.error('Error deleting roadmap feature:', error);
      alert('Error al eliminar la característica');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    setFilters({
      owner: 'all',
      quarter: 'all',
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
    setIsAddOKRModalOpen(true);
  };

  const handleSubmitOKR = async (okrData) => {
    try {
      console.log('📤 Sending OKR data:', okrData);
      const response = await okrService.create(okrData);
      console.log('✅ OKR created successfully:', response);
      setOkrs([response.data, ...okrs]);
    } catch (error) {
      console.error('❌ Error creating OKR:', error);
      console.error('❌ Error response:', error.response?.data);
      alert('Error al crear el OKR: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddFeature = async () => {
    try {
      // For roadmap, we need a product ID
      // You may want to show a modal to select the product
      // For now, let's get the first product or show an error
      const products = await api.get('/products');

      if (!products.data?.data || products.data.data.length === 0) {
        alert('No hay productos disponibles. Por favor, crea un producto primero.');
        return;
      }

      const productId = products.data.data[0].id;

      // Backend expects format "Q1 2026"
      const newFeatureData = {
        title: 'Nueva característica',
        description: 'Descripción de la característica del roadmap',
        targetQuarter: currentQuarter // Required: format "Q1 2026"
      };

      const response = await roadmapService.create(productId, newFeatureData);

      // Transform the new feature to frontend format
      const newFeature = {
        ...response.data,
        productId,
        productName: products.data.data[0].name,
        status: response.data.status ? response.data.status.toLowerCase().replace('_', '-') : 'planned',
        priority: 'medium',
        quarter: response.data.quarter || currentQuarter
      };

      setRoadmapFeatures([newFeature, ...roadmapFeatures]);
    } catch (error) {
      console.error('Error creating roadmap feature:', error);
      alert('Error al crear la característica del roadmap. Detalles: ' + (error.response?.data?.message || error.message));
    }
  };

  // Filter OKRs
  const filteredOKRs = okrs?.filter(okr => {
    // Filter by owner (compare with owner.name from backend)
    if (filters?.owner !== 'all' && okr?.owner?.name !== filters?.owner) {
      return false;
    }

    // Filter by quarter (combine quarter + year like "Q1 2026")
    if (filters?.quarter !== 'all') {
      const okrQuarter = `${okr?.quarter} ${okr?.year}`;
      if (okrQuarter !== filters?.quarter) {
        return false;
      }
    }

    // Filter by status
    if (filters?.status !== 'all' && okr?.status !== filters?.status) {
      return false;
    }

    return true;
  });

  // Filter Roadmap Features
  const filteredFeatures = roadmapFeatures?.filter(feature => {
    // Filter by quarter
    if (filters?.quarter !== 'all' && feature?.quarter !== filters?.quarter) {
      return false;
    }

    // Filter by status
    if (filters?.status !== 'all' && feature?.status !== filters?.status) {
      return false;
    }

    // Filter by priority
    if (filters?.priority !== 'all' && feature?.priority !== filters?.priority) {
      return false;
    }

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
            activeTab={activeTab}
            okrs={okrs}
            roadmapFeatures={roadmapFeatures}
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
                      onKeyResultProgressUpdate={handleKeyResultProgressUpdate}
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

      {/* Add Key Result Modal */}
      <AddKeyResultModal
        isOpen={isAddKRModalOpen}
        onClose={() => {
          setIsAddKRModalOpen(false);
          setSelectedOKR(null);
        }}
        onSubmit={handleSubmitKeyResult}
        okrTitle={selectedOKR?.title || ''}
      />

      {/* Add OKR Modal */}
      <AddOKRModal
        isOpen={isAddOKRModalOpen}
        onClose={() => setIsAddOKRModalOpen(false)}
        onSubmit={handleSubmitOKR}
        currentUserId={JSON.parse(localStorage.getItem('user') || '{}').id}
      />
    </div>
  );
};

export default OKRsAndRoadmapManagement;