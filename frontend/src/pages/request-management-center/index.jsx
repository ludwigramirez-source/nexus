import React, { useState, useEffect } from 'react';
import { requestService } from '../../services/requestService';
import socketService from '../../services/socketService';
import api from '../../services/api';
import * as XLSX from 'xlsx';
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
import Pagination from './components/Pagination';

const RequestManagementCenter = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [requestToEdit, setRequestToEdit] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: [],
    status: [],
    priority: [],
    assignee: [],
    client: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Elementos por página

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Cargar clientes
        const clientsRes = await api.get('/clients').catch(() => ({ data: { data: [] } }));
        setClients(clientsRes.data?.data || []);

        // Usar teamMembers como usuarios (hasta que se implemente el módulo de usuarios)
        setUsers(teamMembers);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Cargar requests desde la API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await requestService.getAll(filters);
        setRequests(data.data || []);
      } catch (error) {
        console.error("Error loading requests:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();

    // Setup Socket.io listeners for real-time updates
    socketService.connect();

    const handleRequestCreated = (newRequest) => {
      setRequests((prev) => [newRequest, ...prev]);
    };

    const handleRequestUpdated = (updatedRequest) => {
      setRequests((prev) =>
        prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
      );
    };

    socketService.on("request:created", handleRequestCreated);
    socketService.on("request:updated", handleRequestUpdated);

    return () => {
      socketService.off("request:created", handleRequestCreated);
      socketService.off("request:updated", handleRequestUpdated);
    };
  }, [filters]);

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
    setCurrentPage(1); // Resetear a página 1 cuando se filtra
  };

  const handleClearFilters = () => {
    setFilters({
      type: [],
      status: [],
      priority: [],
      assignee: [],
      client: []
    });
    setCurrentPage(1); // Resetear a página 1 cuando se limpian filtros
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Resetear a página 1 cuando se busca
  };

  const handleDateRangeChange = (dateRange) => {
    console.log('Date range:', dateRange);
  };

  const handleExportToExcel = () => {
    try {
      const typeLabels = {
        PRODUCT_FEATURE: 'Producto',
        CUSTOMIZATION: 'Personalización',
        BUG: 'Error',
        SUPPORT: 'Soporte',
        INFRASTRUCTURE: 'Infraestructura'
      };

      const statusLabels = {
        INTAKE: 'Intake',
        BACKLOG: 'Backlog',
        IN_PROGRESS: 'En Progreso',
        REVIEW: 'En Revisión',
        DONE: 'Completado',
        REJECTED: 'Rechazado'
      };

      const priorityLabels = {
        CRITICAL: 'Crítica',
        HIGH: 'Alta',
        MEDIUM: 'Media',
        LOW: 'Baja'
      };

      // Preparar datos para Excel
      const excelData = filteredRequests.map(req => ({
        'Número': req.requestNumber || `#${req.id?.substring(0, 8)}`,
        'Título': req.title,
        'Descripción': req.description,
        'Tipo': typeLabels[req.type] || req.type,
        'Estado': statusLabels[req.status] || req.status,
        'Prioridad': priorityLabels[req.priority] || req.priority,
        'Cliente': req.client?.name || '-',
        'Usuarios Asignados': req.assignedUsers?.map(u => u.name).join(', ') || 'Sin asignar',
        'Horas Estimadas': req.estimatedHours,
        'Horas Reales': req.actualHours || 0,
        'Fecha Creación': new Date(req.createdAt).toLocaleDateString('es-MX'),
        'Última Actualización': new Date(req.updatedAt).toLocaleDateString('es-MX')
      }));

      // Crear libro de Excel
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Solicitudes');

      // Ajustar ancho de columnas
      const maxWidth = 50;
      const colWidths = Object.keys(excelData[0] || {}).map(key => ({
        wch: Math.min(
          Math.max(
            key.length,
            ...excelData.map(row => String(row[key] || '').length)
          ) + 2,
          maxWidth
        )
      }));
      worksheet['!cols'] = colWidths;

      // Descargar archivo
      const fileName = `solicitudes_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error al exportar. Por favor intenta de nuevo.');
    }
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

  const handleSaveRequest = (savedRequest, isEdit = false) => {
    if (isEdit) {
      // Actualizar solicitud existente
      console.log('Request updated:', savedRequest);
      setRequests((prev) =>
        prev.map((r) => (r.id === savedRequest.id ? savedRequest : r))
      );
    } else {
      // Agregar nueva solicitud al principio de la lista
      console.log('Request created:', savedRequest);
      setRequests((prev) => [savedRequest, ...prev]);
    }
    setIsRequestModalOpen(false);
    setIsEditMode(false);
    setRequestToEdit(null);
  };

  const handleEditRequest = (requestId) => {
    const request = requests?.find(r => r?.id === requestId);
    if (request) {
      setRequestToEdit(request);
      setIsEditMode(true);
      setIsRequestModalOpen(true);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    const request = requests?.find(r => r?.id === requestId);

    // Regla de negocio: no se puede eliminar si tiene usuarios asignados
    if (request?.assignedUsers && request?.assignedUsers?.length > 0) {
      alert('No se puede eliminar una solicitud que tiene usuarios asignados. Por favor, desasigne a todos los usuarios primero.');
      return;
    }

    if (confirm(`¿Estás seguro de eliminar la solicitud ${request?.requestNumber}?\n\nEsta acción no se puede deshacer.`)) {
      try {
        await requestService.delete(requestId);
        setRequests(prev => prev.filter(r => r.id !== requestId));
        console.log('Request deleted:', requestId);
      } catch (error) {
        console.error('Error deleting request:', error);
        const errorMessage = error?.response?.data?.message ||
                            error?.response?.data?.error ||
                            'Error al eliminar la solicitud';
        alert(errorMessage);
      }
    }
  };

  const handleRequestClick = (requestId) => {
    const request = requests?.find(r => r?.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setIsDetailModalOpen(true);
    }
  };

  // Primero filtrar todas las solicitudes
  const allFilteredRequests = requests?.filter(request => {
    // Filtros por checkboxes
    const matchesType = filters?.type?.length === 0 || filters?.type?.includes(request?.type);
    const matchesStatus = filters?.status?.length === 0 || filters?.status?.includes(request?.status);
    const matchesPriority = filters?.priority?.length === 0 || filters?.priority?.includes(request?.priority);
    const matchesAssignee = filters?.assignee?.length === 0 || filters?.assignee?.includes(request?.assignee?.name || '');
    const matchesClient = filters?.client?.length === 0 || filters?.client?.includes(request?.client);

    // Filtro por búsqueda
    let matchesSearch = true;
    if (searchTerm && searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase().trim();
      matchesSearch =
        // Buscar en número de solicitud
        (request?.requestNumber?.toLowerCase()?.includes(search)) ||
        // Buscar en título
        (request?.title?.toLowerCase()?.includes(search)) ||
        // Buscar en descripción
        (request?.description?.toLowerCase()?.includes(search)) ||
        // Buscar en nombre de cliente
        (request?.client?.name?.toLowerCase()?.includes(search)) ||
        // Buscar en usuarios asignados
        (request?.assignedUsers?.some(user =>
          user?.name?.toLowerCase()?.includes(search)
        ));
    }

    return matchesType && matchesStatus && matchesPriority && matchesAssignee && matchesClient && matchesSearch;
  });

  // Calcular paginación
  const totalPages = Math.ceil(allFilteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Obtener solo los elementos de la página actual
  const paginatedRequests = allFilteredRequests.slice(startIndex, endIndex);

  // Para exportar, usar todos los filtrados
  const filteredRequests = allFilteredRequests;

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
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={handleExportToExcel}
              >
                Exportar
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => {
                  setIsEditMode(false);
                  setRequestToEdit(null);
                  setIsRequestModalOpen(true);
                }}
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
                    requests={requests}
                    users={users}
                    clients={clients}
                  />
                </div>
              </div>
            )}

            <div className={`flex-1 ${isFilterSidebarOpen ? 'lg:w-3/4' : 'w-full'}`}>
              <div className="bg-card rounded-lg border border-border shadow-elevation-2 overflow-hidden">
                {viewMode === 'table' ? (
                  <>
                    <div className="overflow-x-auto">
                      <RequestTable
                        requests={paginatedRequests}
                        onRequestSelect={handleRequestSelect}
                        selectedRequests={selectedRequests}
                        onBulkAction={handleBulkAction}
                        onInlineEdit={handleInlineEdit}
                        onRequestClick={handleRequestClick}
                        onEditRequest={handleEditRequest}
                        onDeleteRequest={handleDeleteRequest}
                      />
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalItems={allFilteredRequests.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </>
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
        onClose={() => {
          setIsRequestModalOpen(false);
          setIsEditMode(false);
          setRequestToEdit(null);
        }}
        onSave={handleSaveRequest}
        isEditMode={isEditMode}
        initialData={requestToEdit}
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