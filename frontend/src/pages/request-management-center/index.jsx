import React, { useState, useEffect } from 'react';
import { requestService } from '../../services/requestService';
import socketService from '../../services/socketService';
import Sidebar from '../../components/ui/Sidebar';
import UserProfileHeader from '../../components/ui/UserProfileHeader';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FilterSidebar from './components/FilterSidebar';
import RequestTable from './components/RequestTable';
import KanbanBoard from './components/KanbanBoard';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import SearchBar from './components/SearchBar';
import RequestCreationModal from './components/RequestCreationModal';
import RequestDetailModal from './components/RequestDetailModal';

const RequestManagementCenter = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: [],
    status: [],
    priority: [],
    assignee: [],
    client: []
  });

const [requests, setRequests] = useState([]);  const [loading, setLoading] = useState(true);  // Cargar requests desde la API  useEffect(() => {    const fetchRequests = async () => {      try {        setLoading(true);        const data = await requestService.getAll(filters);        setRequests(data.data || []);      } catch (error) {        console.error("Error loading requests:", error);        setRequests([]);      } finally {        setLoading(false);      }    };    fetchRequests();    // Setup Socket.io listeners for real-time updates    socketService.connect();        const handleRequestCreated = (newRequest) => {      setRequests((prev) => [newRequest, ...prev]);    };        const handleRequestUpdated = (updatedRequest) => {      setRequests((prev) =>        prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))      );    };        socketService.on("request:created", handleRequestCreated);    socketService.on("request:updated", handleRequestUpdated);        return () => {      socketService.off("request:created", handleRequestCreated);      socketService.off("request:updated", handleRequestUpdated);    };  }, [filters]);

  const teamMembers = [
    { 
      id: 'ana', 
      name: 'Ana García',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_18d0c753c-1763295606875.png',
      avatarAlt: 'Professional headshot of Hispanic woman with long dark hair wearing blue blazer'
    },
    { 
      id: 'mario', 
      name: 'Mario López',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_143b978a3-1763294952544.png',
      avatarAlt: 'Professional headshot of Hispanic man with short black hair in navy suit'
    },
    { 
      id: 'laura', 
      name: 'Laura Martínez',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_18c8d7365-1763294879253.png',
      avatarAlt: 'Professional headshot of Hispanic woman with shoulder-length brown hair wearing white blouse'
    },
    { 
      id: 'carlos', 
      name: 'Carlos Rodríguez',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_145ad4bba-1763294926258.png',
      avatarAlt: 'Professional headshot of Hispanic man with glasses and short dark hair in gray suit'
    }
  ];

  const currentUser = {
    id: 'current-user',
    name: 'Usuario Actual',
    email: 'usuario@example.com'
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleToggleFilterSidebar = () => {
    setIsFilterSidebarOpen(!isFilterSidebarOpen);
  };

  const handleFilterChange = (key, values) => {
    setFilters({ ...filters, [key]: values });
  };

  const handleClearFilters = () => {
    setFilters({
      type: [],
      status: [],
      priority: [],
      assignee: [],
      client: []
    });
  };

  const handleRequestSelect = (ids) => {
    setSelectedRequests(ids);
  };

  const handleBulkAction = (action, value) => {
    if (action === 'assign' && value) {
      // Asignar miembro a todas las solicitudes seleccionadas
      setRequests(prevRequests =>
        prevRequests?.map(request =>
          selectedRequests?.includes(request?.id)
            ? { 
                ...request, 
                assignee: teamMembers?.find(m => m?.id === value),
                lastUpdate: new Date()?.toISOString() 
              }
            : request
        )
      );
      setSelectedRequests([]);
      console.log(`Asignadas ${selectedRequests?.length} solicitudes a miembro:`, value);
    } else if (action === 'status' && value) {
      // Cambiar estado de todas las solicitudes seleccionadas
      setRequests(prevRequests =>
        prevRequests?.map(request =>
          selectedRequests?.includes(request?.id)
            ? { ...request, status: value, lastUpdate: new Date()?.toISOString() }
            : request
        )
      );
      setSelectedRequests([]);
    } else if (action === 'priority' && value) {
      // Cambiar prioridad de todas las solicitudes seleccionadas
      setRequests(prevRequests =>
        prevRequests?.map(request =>
          selectedRequests?.includes(request?.id)
            ? { ...request, priority: value, lastUpdate: new Date()?.toISOString() }
            : request
        )
      );
      setSelectedRequests([]);
    } else {
      console.log('Bulk action:', action, 'on requests:', selectedRequests);
    }
  };

  const handleInlineEdit = (requestId, field, value) => {
    console.log('Inline edit:', requestId, field, value);
  };

  const handleSearch = (searchTerm) => {
    console.log('Search:', searchTerm);
  };

  const handleDateRangeChange = (dateRange) => {
    console.log('Date range:', dateRange);
  };

  const handleSavedFilterSelect = (filterId) => {
    console.log('Saved filter:', filterId);
  };

  const handleRequestMove = (requestId, newStatus) => {
    setRequests(prevRequests => 
      prevRequests?.map(request => 
        request?.id === requestId 
          ? { ...request, status: newStatus, lastUpdate: new Date()?.toISOString() }
          : request
      )
    );
  };

  const handleCreateRequest = (requestData) => {
    console.log('Creating request:', requestData);
    setIsRequestModalOpen(false);
  };

  const handleRequestClick = (requestId) => {
    const request = requests?.find(r => r?.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setIsDetailModalOpen(true);
    }
  };

  const filteredRequests = requests?.filter(request => {
    const matchesType = filters?.type?.length === 0 || filters?.type?.includes(request?.type);
    const matchesStatus = filters?.status?.length === 0 || filters?.status?.includes(request?.status);
    const matchesPriority = filters?.priority?.length === 0 || filters?.priority?.includes(request?.priority);
    const matchesAssignee = filters?.assignee?.length === 0 || filters?.assignee?.includes(request?.assignee?.name || '');
    const matchesClient = filters?.client?.length === 0 || filters?.client?.includes(request?.client);
    
    return matchesType && matchesStatus && matchesPriority && matchesAssignee && matchesClient;
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={handleToggleSidebar} />
      <div className={`transition-smooth ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}`}>
        <header className="sticky top-0 z-40 bg-card border-b border-border shadow-elevation-1">
          <div className="flex items-center justify-between h-20 px-4 md:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground">
                Centro de Gestión de Solicitudes
              </h1>
            </div>

            <div className="flex items-center space-x-3 md:space-x-4">
              <NotificationCenter 
                onMarkAsRead={() => {}} 
                onMarkAllAsRead={() => {}} 
                onClearAll={() => {}} 
              />
              <UserProfileHeader 
                user={{ name: 'Usuario', email: 'usuario@example.com' }} 
                onLogout={() => {}} 
              />
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <Breadcrumb customItems={[]} />

          <div className="mb-4 md:mb-5 lg:mb-6">
            <SearchBar
              onSearch={handleSearch}
              onDateRangeChange={handleDateRangeChange}
              onSavedFilterSelect={handleSavedFilterSelect}
            />
          </div>

          <div className="flex items-center justify-between mb-4 md:mb-5 lg:mb-6">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Button
                variant={isFilterSidebarOpen ? 'default' : 'outline'}
                iconName="Filter"
                iconPosition="left"
                onClick={handleToggleFilterSidebar}
              >
                Filtros
              </Button>
              <Button variant="outline" iconName="Download" iconPosition="left">
                Exportar
              </Button>
              <Button 
                variant="default" 
                iconName="Plus" 
                iconPosition="left"
                onClick={() => setIsRequestModalOpen(true)}
              >
                Nueva Solicitud
              </Button>
            </div>

            <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-md text-sm font-caption font-medium transition-smooth ${
                  viewMode === 'table' ? 'bg-card text-foreground shadow-elevation-1' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="Table" size={18} className="inline mr-2" />
                Tabla
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-md text-sm font-caption font-medium transition-smooth ${
                  viewMode === 'kanban' ? 'bg-card text-foreground shadow-elevation-1' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="LayoutGrid" size={18} className="inline mr-2" />
                Kanban
              </button>
            </div>
          </div>

          <div className="flex gap-4 md:gap-5 lg:gap-6">
            {isFilterSidebarOpen && (
              <div className="w-full lg:w-1/4 hidden lg:block">
                <div className="sticky top-24 h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-border shadow-elevation-2">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </div>
            )}

            <div className={`flex-1 ${isFilterSidebarOpen ? 'lg:w-3/4' : 'w-full'}`}>
              <div className="bg-card rounded-lg border border-border shadow-elevation-2 overflow-hidden">
                {viewMode === 'table' ? (
                  <div className="overflow-x-auto">
                    <RequestTable
                      requests={filteredRequests}
                      onRequestSelect={handleRequestSelect}
                      selectedRequests={selectedRequests}
                      onBulkAction={handleBulkAction}
                      onInlineEdit={handleInlineEdit}
                      onRequestClick={handleRequestClick}
                    />
                  </div>
                ) : (
                  <div className="p-4 md:p-5 lg:p-6 h-[calc(100vh-20rem)] overflow-y-auto">
                    <KanbanBoard 
                      requests={filteredRequests} 
                      onRequestMove={handleRequestMove}
                      onRequestClick={handleRequestClick}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <BulkActionsToolbar
            selectedCount={selectedRequests?.length}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedRequests([])}
            teamMembers={teamMembers}
          />
        </main>
      </div>

      <RequestCreationModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSave={handleCreateRequest}
      />

      {isDetailModalOpen && selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedRequest(null);
          }}
          teamMembers={teamMembers}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default RequestManagementCenter;