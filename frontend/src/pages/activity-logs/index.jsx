import React, { useState, useEffect } from 'react';
import { activityLogsService } from '../../services/activityLogsService';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import Sidebar from '../../components/ui/Sidebar';
import UserProfileHeader from '../../components/ui/UserProfileHeader';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const ActivityLogs = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    entity: '',
    startDate: '',
    endDate: '',
    search: '',
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    if (currentUser) {
      // When user is loaded, check admin status
      const adminRoles = ['CEO', 'ADMIN', 'DEV_DIRECTOR'];
      setIsAdmin(adminRoles.includes(currentUser.role));
    }
  }, [currentUser]);

  const fetchCurrentUser = async () => {
    try {
      const userData = await authService.getMe();
      setCurrentUser(userData);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll({ limit: 1000 });
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await activityLogsService.getAll({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });

      setLogs(response.logs || []);
      setPagination(response.pagination || pagination);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchLogs();
  };

  const handleClearFilters = () => {
    setFilters({
      userId: '',
      action: '',
      entity: '',
      startDate: '',
      endDate: '',
      search: '',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    setTimeout(() => fetchLogs(), 0);
  };

  const handleExport = async () => {
    try {
      await activityLogsService.exportToCsv(filters);
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionColor = (action) => {
    const colors = {
      LOGIN: 'text-success bg-success/10',
      LOGOUT: 'text-muted-foreground bg-muted',
      REGISTER: 'text-primary bg-primary/10',
      CREATE: 'text-success bg-success/10',
      UPDATE: 'text-amber-600 bg-amber-600/10',
      DELETE: 'text-error bg-error/10',
      STATUS_CHANGE: 'text-purple-600 bg-purple-600/10',
    };
    return colors[action] || 'text-muted-foreground bg-muted';
  };

  const getActionIcon = (action) => {
    const icons = {
      LOGIN: 'LogIn',
      LOGOUT: 'LogOut',
      REGISTER: 'UserPlus',
      CREATE: 'Plus',
      UPDATE: 'Edit',
      DELETE: 'Trash2',
      STATUS_CHANGE: 'RefreshCw',
    };
    return icons[action] || 'Activity';
  };

  const actionOptions = [
    { value: '', label: 'Todas las acciones' },
    { value: 'LOGIN', label: 'Inicio de sesión' },
    { value: 'LOGOUT', label: 'Cierre de sesión' },
    { value: 'REGISTER', label: 'Registro' },
    { value: 'CREATE', label: 'Crear' },
    { value: 'UPDATE', label: 'Actualizar' },
    { value: 'DELETE', label: 'Eliminar' },
    { value: 'STATUS_CHANGE', label: 'Cambio de estado' },
  ];

  const entityOptions = [
    { value: '', label: 'Todas las entidades' },
    { value: 'USER', label: 'Usuario' },
    { value: 'REQUEST', label: 'Solicitud' },
    { value: 'CLIENT', label: 'Cliente' },
    { value: 'PRODUCT', label: 'Producto' },
    { value: 'ASSIGNMENT', label: 'Asignación' },
    { value: 'OKR', label: 'OKR' },
  ];

  const userOptions = [
    { value: '', label: 'Todos los usuarios' },
    ...users.map((user) => ({
      value: user.id,
      label: `${user.name} (${user.email})`,
    })),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        activePage="activity-logs"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`
          transition-smooth
          ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}
        `}
      >
        <header className="sticky top-0 z-30 bg-card border-b border-border shadow-elevation-1 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Breadcrumb items={[{ label: 'Registro de Actividades', icon: 'Activity' }]} />
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <UserProfileHeader />
            </div>
          </div>
        </header>

        <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {/* Filters Section */}
          <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-foreground">Filtros</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  iconName="X"
                  iconPosition="left"
                >
                  Limpiar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApplyFilters}
                  iconName="Filter"
                  iconPosition="left"
                >
                  Aplicar Filtros
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleExport}
                  iconName="Download"
                  iconPosition="left"
                >
                  Exportar Excel
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isAdmin && (
                <div>
                  <label className="block text-sm font-caption font-medium text-foreground mb-2">
                    Usuario
                  </label>
                  <Select
                    options={userOptions}
                    value={filters.userId}
                    onChange={(value) => handleFilterChange('userId', value)}
                    placeholder="Seleccionar usuario"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-caption font-medium text-foreground mb-2">
                  Acción
                </label>
                <Select
                  options={actionOptions}
                  value={filters.action}
                  onChange={(value) => handleFilterChange('action', value)}
                  placeholder="Seleccionar acción"
                />
              </div>
              <div>
                <label className="block text-sm font-caption font-medium text-foreground mb-2">
                  Entidad
                </label>
                <Select
                  options={entityOptions}
                  value={filters.entity}
                  onChange={(value) => handleFilterChange('entity', value)}
                  placeholder="Seleccionar entidad"
                />
              </div>
              <div>
                <label className="block text-sm font-caption font-medium text-foreground mb-2">
                  Fecha Inicio
                </label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-caption font-medium text-foreground mb-2">
                  Fecha Fin
                </label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-caption font-medium text-foreground mb-2">
                  Buscar
                </label>
                <Input
                  placeholder="Buscar en descripción..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Activity Logs Table */}
          <div className="bg-card rounded-lg border border-border shadow-elevation-1 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-caption font-medium text-muted-foreground uppercase tracking-wider">
                      Fecha y Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-caption font-medium text-muted-foreground uppercase tracking-wider">
                      Realizado Por
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-caption font-medium text-muted-foreground uppercase tracking-wider">
                      Usuario Afectado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-caption font-medium text-muted-foreground uppercase tracking-wider">
                      Acción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-caption font-medium text-muted-foreground uppercase tracking-wider">
                      Entidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-caption font-medium text-muted-foreground uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-caption font-medium text-muted-foreground uppercase tracking-wider">
                      IP
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center">
                          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
                          <span className="ml-2 text-sm text-muted-foreground">Cargando...</span>
                        </div>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground">No se encontraron registros</p>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      // Extract target user from metadata if exists
                      const targetUser = log.metadata?.targetUser;

                      return (
                        <tr key={log.id} className="hover:bg-muted/30 transition-smooth">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-caption text-foreground">
                              {formatTimestamp(log.createdAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Icon name="User" size={16} className="text-primary" />
                              </div>
                              <div>
                                <div className="text-sm font-caption font-medium text-foreground">
                                  {log.userName || 'Sistema'}
                                </div>
                                <div className="text-xs font-caption text-muted-foreground">
                                  {log.userEmail || '-'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {targetUser ? (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                  <Icon name="UserCheck" size={16} className="text-amber-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-caption font-medium text-foreground">
                                    {targetUser.name}
                                  </div>
                                  <div className="text-xs font-caption text-muted-foreground">
                                    {targetUser.email}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm font-caption text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-caption font-medium ${getActionColor(
                                log.action
                              )}`}
                            >
                              <Icon name={getActionIcon(log.action)} size={14} />
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-caption text-foreground">{log.entity}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-caption text-muted-foreground line-clamp-2">
                              {log.description}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-caption text-muted-foreground">
                              {log.ipAddress || '-'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && logs.length > 0 && (
              <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Mostrando {(pagination.page - 1) * pagination.limit + 1} -{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}{' '}
                  registros
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                  >
                    <Icon name="ChevronLeft" size={16} />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === pagination.totalPages ||
                          Math.abs(page - pagination.page) <= 1
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-muted-foreground">...</span>
                          )}
                          <Button
                            variant={pagination.page === page ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setPagination((prev) => ({ ...prev, page }))}
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActivityLogs;
