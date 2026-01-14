import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import UserProfileHeader from '../../components/ui/UserProfileHeader';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LoginForm from './components/LoginForm';
import SessionCard from './components/SessionCard';
import ActivityLogTable from './components/ActivityLogTable';
import SecurityAlertCard from './components/SecurityAlertCard';
import PermissionMatrix from './components/PermissionMatrix';
import PasswordPolicyCard from './components/PasswordPolicyCard';

const AuthenticationAndAccessControl = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('sessions');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const mockSessions = [
    {
      id: 1,
      deviceType: 'desktop',
      deviceName: 'Windows 11 - Chrome',
      location: 'Ciudad de México, México',
      browser: 'Chrome',
      browserVersion: '120.0',
      ipAddress: '189.203.45.123',
      loginTime: '2026-01-07T02:50:42',
      lastActivity: '2026-01-07T02:50:42',
      isCurrent: true
    },
    {
      id: 2,
      deviceType: 'mobile',
      deviceName: 'iPhone 15 Pro - Safari',
      location: 'Guadalajara, México',
      browser: 'Safari',
      browserVersion: '17.2',
      ipAddress: '189.145.78.234',
      loginTime: '2026-01-06T18:30:00',
      lastActivity: '2026-01-07T01:15:00',
      isCurrent: false
    },
    {
      id: 3,
      deviceType: 'tablet',
      deviceName: 'iPad Air - Safari',
      location: 'Monterrey, México',
      browser: 'Safari',
      browserVersion: '17.1',
      ipAddress: '189.167.92.145',
      loginTime: '2026-01-05T14:20:00',
      lastActivity: '2026-01-06T22:45:00',
      isCurrent: false
    }
  ];

  const mockActivities = [
    {
      id: 1,
      type: 'login',
      typeLabel: 'Inicio de Sesión',
      description: 'Inicio de sesión exitoso desde Windows 11',
      location: 'Ciudad de México, México',
      ipAddress: '189.203.45.123',
      timestamp: '2026-01-07T02:50:42'
    },
    {
      id: 2,
      type: 'password_change',
      typeLabel: 'Cambio de Contraseña',
      description: 'Contraseña actualizada correctamente',
      location: 'Ciudad de México, México',
      ipAddress: '189.203.45.123',
      timestamp: '2026-01-06T16:30:00'
    },
    {
      id: 3,
      type: 'failed_login',
      typeLabel: 'Intento Fallido',
      description: 'Intento de inicio de sesión fallido - contraseña incorrecta',
      location: 'Desconocida',
      ipAddress: '45.123.67.89',
      timestamp: '2026-01-06T14:15:00'
    },
    {
      id: 4,
      type: 'logout',
      typeLabel: 'Cierre de Sesión',
      description: 'Sesión cerrada desde iPhone 15 Pro',
      location: 'Guadalajara, México',
      ipAddress: '189.145.78.234',
      timestamp: '2026-01-06T12:00:00'
    },
    {
      id: 5,
      type: 'permission_change',
      typeLabel: 'Cambio de Permisos',
      description: 'Permisos actualizados para módulo de Analytics',
      location: 'Ciudad de México, México',
      ipAddress: '189.203.45.123',
      timestamp: '2026-01-05T10:45:00'
    },
    {
      id: 6,
      type: 'login',
      typeLabel: 'Inicio de Sesión',
      description: 'Inicio de sesión desde iPad Air',
      location: 'Monterrey, México',
      ipAddress: '189.167.92.145',
      timestamp: '2026-01-05T09:20:00'
    },
    {
      id: 7,
      type: 'session_timeout',
      typeLabel: 'Sesión Expirada',
      description: 'Sesión cerrada automáticamente por inactividad',
      location: 'Ciudad de México, México',
      ipAddress: '189.203.45.123',
      timestamp: '2026-01-04T18:00:00'
    },
    {
      id: 8,
      type: 'failed_login',
      typeLabel: 'Intento Fallido',
      description: 'Múltiples intentos fallidos detectados',
      location: 'Desconocida',
      ipAddress: '123.45.67.89',
      timestamp: '2026-01-04T03:30:00'
    }
  ];

  const mockSecurityAlerts = [
    {
      id: 1,
      severity: 'high',
      title: 'Intento de Acceso Sospechoso',
      description: 'Se detectaron 5 intentos fallidos de inicio de sesión desde una ubicación no reconocida en las últimas 2 horas.',
      timestamp: '2026-01-07T01:30:00',
      details: [
        'IP de origen: 45.123.67.89',
        'Ubicación: Desconocida',
        'Intentos: 5 en 2 horas',
        'Última actividad: Hace 1 hora'
      ],
      actionRequired: true
    },
    {
      id: 2,
      severity: 'medium',
      title: 'Contraseña Próxima a Expirar',
      description: 'Su contraseña expirará en 7 días. Se recomienda cambiarla antes de la fecha de vencimiento.',
      timestamp: '2026-01-06T09:00:00',
      details: [
        'Fecha de expiración: 14/01/2026',
        'Días restantes: 7',
        'Última actualización: 14/10/2025'
      ],
      actionRequired: true
    },
    {
      id: 3,
      severity: 'low',
      title: 'Nueva Sesión Iniciada',
      description: 'Se inició una nueva sesión desde un dispositivo móvil en Guadalajara.',
      timestamp: '2026-01-06T18:30:00',
      details: [
        'Dispositivo: iPhone 15 Pro',
        'Ubicación: Guadalajara, México',
        'IP: 189.145.78.234'
      ],
      actionRequired: false
    }
  ];

  const mockRoles = [
    { id: 'ceo', name: 'CEO', icon: 'Crown' },
    { id: 'director', name: 'Director', icon: 'Briefcase' },
    { id: 'developer', name: 'Desarrollador', icon: 'Code' }
  ];

  const mockModules = [
    {
      id: 'dashboard',
      name: 'Dashboard Ejecutivo',
      icon: 'LayoutDashboard',
      subModules: [
        { id: 'dashboard-metrics', name: 'Métricas KPI' },
        { id: 'dashboard-reports', name: 'Reportes' }
      ]
    },
    {
      id: 'requests',
      name: 'Gestión de Solicitudes',
      icon: 'Inbox',
      subModules: [
        { id: 'requests-create', name: 'Crear Solicitudes' },
        { id: 'requests-assign', name: 'Asignar Solicitudes' }
      ]
    },
    {
      id: 'capacity',
      name: 'Planificación de Capacidad',
      icon: 'Calendar',
      subModules: [
        { id: 'capacity-planning', name: 'Planificación' },
        { id: 'capacity-allocation', name: 'Asignación' }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics e Insights',
      icon: 'BarChart3',
      subModules: [
        { id: 'analytics-view', name: 'Ver Analytics' },
        { id: 'analytics-export', name: 'Exportar Datos' }
      ]
    }
  ];

  const mockPermissions = [
    { roleId: 'ceo', moduleId: 'dashboard', type: 'read' },
    { roleId: 'ceo', moduleId: 'dashboard', type: 'write' },
    { roleId: 'ceo', moduleId: 'dashboard', type: 'delete' },
    { roleId: 'ceo', moduleId: 'requests', type: 'read' },
    { roleId: 'ceo', moduleId: 'requests', type: 'write' },
    { roleId: 'director', moduleId: 'dashboard', type: 'read' },
    { roleId: 'director', moduleId: 'requests', type: 'read' },
    { roleId: 'director', moduleId: 'requests', type: 'write' },
    { roleId: 'director', moduleId: 'capacity', type: 'read' },
    { roleId: 'director', moduleId: 'capacity', type: 'write' },
    { roleId: 'developer', moduleId: 'requests', type: 'read' },
    { roleId: 'developer', moduleId: 'capacity', type: 'read' }
  ];

  const mockPasswordPolicy = {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
    expirationDays: 90,
    maxFailedAttempts: 5,
    lockoutDuration: 30
  };

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);

    const roleRoutes = {
      CEO: '/executive-dashboard',
      Director: '/capacity-planning-workspace',
      Developer: '/request-management-center'
    };

    setTimeout(() => {
      navigate(roleRoutes?.[userData?.role] || '/executive-dashboard');
    }, 500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleTerminateSession = (sessionId) => {
    console.log('Terminating session:', sessionId);
  };

  const handleDismissAlert = (alertId) => {
    console.log('Dismissing alert:', alertId);
  };

  const handleViewAlertDetails = (alert) => {
    console.log('Viewing alert details:', alert);
  };

  const handlePermissionChange = (roleId, moduleId, permissionType, value) => {
    console.log('Permission change:', { roleId, moduleId, permissionType, value });
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const tabs = [
    { id: 'sessions', label: 'Sesiones Activas', icon: 'Monitor' },
    { id: 'activity', label: 'Registro de Actividad', icon: 'Activity' },
    { id: 'security', label: 'Alertas de Seguridad', icon: 'Shield' },
    { id: 'permissions', label: 'Matriz de Permisos', icon: 'Lock' },
    { id: 'policy', label: 'Política de Contraseñas', icon: 'Key' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <LoginForm onLogin={handleLogin} onForgotPassword={handleForgotPassword} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`
        transition-smooth
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}
      `}>
        <header className="sticky top-0 z-40 bg-card border-b border-border shadow-elevation-1">
          <div className="flex items-center justify-between h-20 px-4 md:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground">
                Autenticación y Control de Acceso
              </h1>
            </div>
            <div className="flex items-center space-x-3 md:space-x-4">
              <NotificationCenter />
              <UserProfileHeader user={currentUser} onLogout={handleLogout} />
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <Breadcrumb />

          <div className="mb-6 p-4 md:p-6 bg-card rounded-lg border border-border shadow-elevation-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <Icon name="CheckCircle" size={32} className="text-success" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                    Sesión Activa - {currentUser?.name}
                  </h2>
                  <p className="text-sm md:text-base font-caption text-muted-foreground">
                    Rol: {currentUser?.role} | Último acceso: {new Date()?.toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Key"
                >
                  Cambiar Contraseña
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Settings"
                >
                  Preferencias
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2.5 rounded-lg font-caption font-medium transition-smooth
                  ${activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground shadow-elevation-2'
                    : 'bg-card text-foreground hover:bg-muted border border-border'
                  }
                `}
              >
                <Icon name={tab?.icon} size={18} />
                <span className="text-sm md:text-base">{tab?.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                  Sesiones Activas ({mockSessions?.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="LogOut"
                >
                  Cerrar Todas las Sesiones
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockSessions?.map(session => (
                  <SessionCard
                    key={session?.id}
                    session={session}
                    onTerminate={handleTerminateSession}
                    isCurrent={session?.isCurrent}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                  Registro de Actividad
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                >
                  Exportar Registro
                </Button>
              </div>
              <ActivityLogTable activities={mockActivities} />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                  Alertas de Seguridad ({mockSecurityAlerts?.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCw"
                >
                  Actualizar
                </Button>
              </div>
              {mockSecurityAlerts?.map(alert => (
                <SecurityAlertCard
                  key={alert?.id}
                  alert={alert}
                  onDismiss={handleDismissAlert}
                  onViewDetails={handleViewAlertDetails}
                />
              ))}
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                    Matriz de Permisos
                  </h3>
                  <p className="text-sm md:text-base font-caption text-muted-foreground mt-1">
                    Control de acceso basado en roles
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Save"
                >
                  Guardar Cambios
                </Button>
              </div>
              <PermissionMatrix
                roles={mockRoles}
                modules={mockModules}
                permissions={mockPermissions}
                onPermissionChange={handlePermissionChange}
              />
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PasswordPolicyCard policy={mockPasswordPolicy} />
              <div className="space-y-4">
                <div className="p-4 md:p-6 bg-card rounded-lg border border-border shadow-elevation-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Icon name="Shield" size={24} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
                        Autenticación de Dos Factores
                      </h3>
                      <p className="text-xs md:text-sm font-caption text-muted-foreground">
                        Seguridad adicional para su cuenta
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-caption text-foreground">Estado</span>
                      <span className="px-2 py-1 text-xs font-caption font-medium text-success-foreground bg-success rounded-full">
                        Activado
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-caption text-foreground">Método</span>
                      <span className="text-sm font-caption text-muted-foreground">
                        Aplicación Autenticadora
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      iconName="Settings"
                    >
                      Configurar 2FA
                    </Button>
                  </div>
                </div>

                <div className="p-4 md:p-6 bg-card rounded-lg border border-border shadow-elevation-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon name="Clock" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
                        Tiempo de Sesión
                      </h3>
                      <p className="text-xs md:text-sm font-caption text-muted-foreground">
                        Configuración de expiración
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-caption text-foreground">Tiempo de inactividad</span>
                      <span className="text-sm font-caption text-muted-foreground">30 minutos</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-caption text-foreground">Duración máxima</span>
                      <span className="text-sm font-caption text-muted-foreground">8 horas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AuthenticationAndAccessControl;