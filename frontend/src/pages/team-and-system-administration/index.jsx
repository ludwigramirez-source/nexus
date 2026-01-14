import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { systemConfigService } from '../../services/systemConfigService';
import socketService from '../../services/socketService';
import Sidebar from '../../components/ui/Sidebar';
import UserProfileHeader from '../../components/ui/UserProfileHeader';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UserManagementTable from './components/UserManagementTable';
import UserFormModal from './components/UserFormModal';
import SystemConfigPanel from './components/SystemConfigPanel';
import ActivityLogPanel from './components/ActivityLogPanel';
import NavigationTree from './components/NavigationTree';
import RolePermissionModal from './components/RolePermissionModal';
import SkillManagementModal from './components/SkillManagementModal';
import SystemRolesModal from './components/SystemRolesModal';
import SystemSkillsModal from './components/SystemSkillsModal';
import PermissionsManagement from './components/PermissionsManagement';

const TeamAndSystemAdministration = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('users');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isSystemRolesModalOpen, setIsSystemRolesModalOpen] = useState(false);
  const [isSystemSkillsModalOpen, setIsSystemSkillsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para mapear usuarios del backend al formato del frontend
  const mapUserFromBackend = (user) => {
    const roleMap = {
      'CEO': { value: 'ceo', label: 'CEO' },
      'DEV_DIRECTOR': { value: 'director', label: 'Director de Desarrollo' },
      'BACKEND': { value: 'backend', label: 'Desarrollador Backend' },
      'FRONTEND': { value: 'frontend', label: 'Desarrollador Frontend' },
      'FULLSTACK': { value: 'fullstack', label: 'Desarrollador Full Stack' },
      'SOPORTE_VOIP': { value: 'soporte_voip', label: 'Soporte VoIP' }
    };

    const statusMap = {
      'ACTIVE': { value: 'active', label: 'Activo' },
      'INACTIVE': { value: 'inactive', label: 'Inactivo' }
    };

    const roleInfo = roleMap[user.role] || { value: user.role.toLowerCase(), label: user.role };
    const statusInfo = statusMap[user.status] || { value: user.status.toLowerCase(), label: user.status };

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleInfo.value,
      roleLabel: roleInfo.label,
      status: statusInfo.value,
      statusLabel: statusInfo.label,
      avatar: user.avatar || "https://img.rocket.new/generatedImages/rocket_gen_img_116742dea-1763296857162.png",
      avatarAlt: `Avatar de ${user.name}`,
      capacity: user.capacity,
      skills: user.skills || []
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersData = await userService.getAll();
        const mappedUsers = (usersData.data || []).map(mapUserFromBackend);
        setUsers(mappedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socketService.connect();

    const handleUserCreated = (newUser) => {
      setUsers((prev) => [mapUserFromBackend(newUser), ...prev]);
    };

    const handleUserUpdated = (updatedUser) => {
      setUsers((prev) => prev.map(u => u.id === updatedUser.id ? mapUserFromBackend(updatedUser) : u));
    };

    const handleUserDeleted = (deletedUserId) => {
      setUsers((prev) => prev.filter(u => u.id !== deletedUserId));
    };

    socketService.on('user:created', handleUserCreated);
    socketService.on('user:updated', handleUserUpdated);
    socketService.on('user:deleted', handleUserDeleted);

    return () => {
      socketService.off('user:created', handleUserCreated);
      socketService.off('user:updated', handleUserUpdated);
      socketService.off('user:deleted', handleUserDeleted);
    };
  }, []);

  const [systemConfig, setSystemConfig] = useState({
    general: {
      companyName: 'IPTEGRA',
      contactEmail: 'contacto@iptegra.com',
      currency: 'MXN',
      timezone: 'America/Mexico_City',
      dateFormat: 'DD/MM/YYYY',
      language: 'Español',
      notifications: {
        capacityAlerts: true,
        requestUpdates: true,
        okrReminders: true
      }
    },
    products: {
      targetRatio: 70,
      ratioAlertThreshold: 50,
      requestCategories: {
        productFeature: true,
        customization: true,
        bugFix: true,
        support: true,
        infrastructure: true
      }
    },
    clients: {
      healthScoreThreshold: 60,
      healthCheckInterval: 30,
      tiers: {
        enterprise: true,
        professional: true,
        standard: true
      }
    },
    okrs: {
      cycleDuration: 13,
      atRiskThreshold: 50,
      weeklyReminders: true,
      atRiskAlerts: true,
      endOfCycleSummary: true
    }
  });

  const [activities, setActivities] = useState([]);

  // Guardar configuración inicial en localStorage
  useEffect(() => {
    localStorage.setItem('systemConfig', JSON.stringify(systemConfig));
  }, [systemConfig]);

  // Cargar toda la configuración desde API
  useEffect(() => {
    const loadAllConfig = async () => {
      try {
        const response = await systemConfigService.getAllConfig();
        if (response?.data) {
          setSystemConfig(prev => ({
            ...prev,
            general: response.data.general || prev.general,
            products: response.data.products || prev.products,
            clients: response.data.clients || prev.clients,
            company: response.data.company || prev.company,
            okrs: response.data.okrs || prev.okrs,
          }));
        }
      } catch (error) {
        console.error('Error loading config:', error);
      }
    };

    loadAllConfig();
  }, []);

  const handleCreateUser = () => {
    setModalMode('create');
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsers((prev) => prev?.filter((u) => u?.id !== userId));

      const newActivity = {
        id: activities?.length + 1,
        type: 'delete',
        action: 'Usuario eliminado',
        description: `Se eliminó un usuario del sistema`,
        userName: 'Carlos Rodríguez',
        userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_116742dea-1763296857162.png",
        userAvatarAlt: 'Professional headshot of Hispanic man with short black hair and beard wearing blue shirt',
        timestamp: new Date()?.toISOString()
      };
      setActivities((prev) => [newActivity, ...prev]);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      // Mapear status del frontend al backend
      const newStatus = currentStatus === 'active' ? 'INACTIVE' : 'ACTIVE';

      await userService.updateStatus(userId, newStatus);

      // Actualizar la lista de usuarios desde el servidor
      const usersData = await userService.getAll();
      const mappedUsers = (usersData.data || []).map(mapUserFromBackend);
      setUsers(mappedUsers);

      const statusLabel = newStatus === 'ACTIVE' ? 'activado' : 'desactivado';
      alert(`Usuario ${statusLabel} exitosamente`);

      const newActivity = {
        id: activities?.length + 1,
        type: 'edit',
        action: 'Estado de usuario modificado',
        description: `Se ${statusLabel} un usuario`,
        userName: 'Administrador',
        userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_116742dea-1763296857162.png",
        userAvatarAlt: 'Professional headshot',
        timestamp: new Date()?.toISOString()
      };
      setActivities((prev) => [newActivity, ...prev]);
    } catch (error) {
      console.error('Error cambiando estado de usuario:', error);
      alert(`Error: ${error.response?.data?.message || error.message || 'No se pudo cambiar el estado del usuario'}`);
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      // Función para mapear roles del formulario al formato del backend
      const mapRoleToBackend = (role) => {
        const roleMap = {
          'ceo': 'CEO',
          'director': 'DEV_DIRECTOR',
          'dev_director': 'DEV_DIRECTOR',
          'backend': 'BACKEND',
          'frontend': 'FRONTEND',
          'fullstack': 'FULLSTACK',
          'soporte_voip': 'SOPORTE_VOIP'
        };

        // Si existe en el map, usarlo
        if (roleMap[role]) return roleMap[role];

        // Si no, convertir automáticamente: 'mi_rol' -> 'MI_ROL'
        // Reemplazar espacios con guiones bajos antes de convertir a mayúsculas
        return role.replace(/\s+/g, '_').toUpperCase();
      };

      // Dividir nombre en firstName y lastName
      const nameParts = userData?.name?.trim()?.split(' ');
      const firstName = nameParts?.[0] || userData?.name;
      const lastName = nameParts?.slice(1)?.join(' ') || '';

      if (modalMode === 'create') {
        // Preparar datos para registro
        const registerData = {
          email: userData.email,
          password: userData.password,
          firstName: firstName,
          lastName: lastName,
          role: mapRoleToBackend(userData.role)
        };

        console.log('Registrando usuario:', registerData);

        // Llamar al backend para registrar usuario
        const result = await authService.register(registerData);

        console.log('Usuario creado exitosamente:', result);

        // Actualizar lista de usuarios desde el servidor
        const usersData = await userService.getAll();
        const mappedUsers = (usersData.data || []).map(mapUserFromBackend);
        setUsers(mappedUsers);

        const newActivity = {
          id: activities?.length + 1,
          type: 'user',
          action: 'Usuario creado',
          description: `Se agregó ${userData?.name} al equipo como ${getRoleLabel(userData?.role)}`,
          userName: 'Administrador',
          userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_116742dea-1763296857162.png",
          userAvatarAlt: 'Professional headshot',
          timestamp: new Date()?.toISOString()
        };
        setActivities((prev) => [newActivity, ...prev]);

        alert('Usuario creado exitosamente');
      } else {
        // Actualizar usuario existente
        const updateData = {
          name: userData.name,
          email: userData.email,
          role: mapRoleToBackend(userData.role),
          capacity: userData.capacity,
          skills: userData.skills,
          status: userData.status === 'active' ? 'ACTIVE' : 'INACTIVE'
        };

        console.log('Actualizando usuario:', selectedUser.id, updateData);
        await userService.update(selectedUser.id, updateData);

        // Si se proporcionó una nueva contraseña, actualizarla
        if (userData.password && userData.password.trim()) {
          console.log('Actualizando contraseña para usuario:', selectedUser.id);
          await userService.updatePassword(selectedUser.id, userData.password);
        }

        // Actualizar lista de usuarios desde el servidor
        const usersData = await userService.getAll();
        const mappedUsers = (usersData.data || []).map(mapUserFromBackend);
        setUsers(mappedUsers);

        const newActivity = {
          id: activities?.length + 1,
          type: 'edit',
          action: 'Usuario modificado',
          description: `Se actualizó la información de ${userData?.name}${userData.password ? ' (incluyendo contraseña)' : ''}`,
          userName: 'Administrador',
          userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_116742dea-1763296857162.png",
          userAvatarAlt: 'Professional headshot',
          timestamp: new Date()?.toISOString()
        };
        setActivities((prev) => [newActivity, ...prev]);

        alert(`Usuario actualizado exitosamente${userData.password ? '. La contraseña fue cambiada.' : ''}`);
      }
    } catch (error) {
      console.error('Error guardando usuario:', error);
      alert(`Error: ${error.response?.data?.message || error.message || 'No se pudo guardar el usuario'}`);
    }
  };

  const handleBulkAction = (action, userIds) => {
    if (action === 'delete') {
      if (window.confirm(`¿Estás seguro de que deseas eliminar ${userIds?.length} usuarios?`)) {
        setUsers((prev) => prev?.filter((u) => !userIds?.includes(u?.id)));

        const newActivity = {
          id: activities?.length + 1,
          type: 'delete',
          action: 'Eliminación masiva',
          description: `Se eliminaron ${userIds?.length} usuarios del sistema`,
          userName: 'Carlos Rodríguez',
          userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_116742dea-1763296857162.png",
          userAvatarAlt: 'Professional headshot of Hispanic man with short black hair and beard wearing blue shirt',
          timestamp: new Date()?.toISOString()
        };
        setActivities((prev) => [newActivity, ...prev]);
      }
    }
  };

  const handleSaveConfig = async (newConfig) => {
    setSystemConfig(newConfig);

    // Guardar configuración en localStorage para que esté disponible en toda la aplicación
    localStorage.setItem('systemConfig', JSON.stringify(newConfig));

    // Guardar cada sección en su endpoint correspondiente
    try {
      const savePromises = [];

      if (newConfig?.general) {
        savePromises.push(systemConfigService.updateGeneralConfig(newConfig.general));
      }
      if (newConfig?.products) {
        savePromises.push(systemConfigService.updateProductsConfig(newConfig.products));
      }
      if (newConfig?.clients) {
        savePromises.push(systemConfigService.updateClientsConfig(newConfig.clients));
      }
      if (newConfig?.company) {
        savePromises.push(systemConfigService.updateCompanyConfig(newConfig.company));
      }
      if (newConfig?.okrs) {
        savePromises.push(systemConfigService.updateOkrsConfig(newConfig.okrs));
      }

      await Promise.all(savePromises);
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error al guardar la configuración. Por favor intenta nuevamente.');
      return;
    }

    const newActivity = {
      id: activities?.length + 1,
      type: 'config',
      action: 'Configuración actualizada',
      description: 'Se guardaron los cambios en la configuración del sistema',
      userName: 'Ludwig Schmidt',
      userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1450199c9-1763293208253.png",
      userAvatarAlt: 'Professional headshot of mature businessman with gray hair wearing navy suit',
      timestamp: new Date()?.toISOString()
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const handleCreateRole = () => {
    setModalMode('create');
    setSelectedRole(null);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = (roleData) => {
    console.log('Saving role:', roleData);
    setIsRoleModalOpen(false);
  };

  const handleCreateSkill = () => {
    setModalMode('create');
    setSelectedSkill(null);
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = (skillData) => {
    console.log('Saving skill:', skillData);
    setIsSkillModalOpen(false);
  };

  const getRoleLabel = (role) => {
    const labels = {
      ceo: 'CEO',
      director: 'Director de Desarrollo',
      backend: 'Desarrollador Backend',
      frontend: 'Desarrollador Frontend',
      fullstack: 'Desarrollador Full Stack'
    };
    return labels?.[role] || role;
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const renderContent = () => {
    if (activeSection === 'users') {
      return (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-semibold text-foreground">
                Gestión de Usuarios
              </h2>
              <p className="text-sm md:text-base font-caption text-muted-foreground mt-1">
                Administra los miembros del equipo, roles y permisos
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="default"
                iconName="UserPlus"
                iconPosition="left"
                onClick={handleCreateUser}>
                Agregar Usuario
              </Button>
              <Button
                variant="outline"
                iconName="Shield"
                iconPosition="left"
                onClick={() => {
                  console.log('Botón Gestionar Roles clickeado');
                  setIsSystemRolesModalOpen(true);
                  console.log('isSystemRolesModalOpen set to true');
                }}>
                Gestionar Roles
              </Button>
              <Button
                variant="outline"
                iconName="Zap"
                iconPosition="left"
                onClick={() => setIsSystemSkillsModalOpen(true)}>
                Gestionar Habilidades
              </Button>
            </div>
          </div>

          <UserManagementTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
            onBulkAction={handleBulkAction} />
        </div>);
    }

    if (activeSection === 'roles') {
      return (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-foreground">
              Gestión de Permisos
            </h2>
            <p className="text-sm md:text-base font-caption text-muted-foreground mt-1">
              Asigna permisos de acceso a cada rol del sistema
            </p>
          </div>

          <PermissionsManagement />
        </div>
      );
    }


    if (['general', 'products', 'clients', 'okrs', 'integrations']?.includes(activeSection)) {
      return (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-foreground">
              Configuración del Sistema
            </h2>
            <p className="text-sm md:text-base font-caption text-muted-foreground mt-1">
              Personaliza los parámetros operacionales de la plataforma
            </p>
          </div>

          <SystemConfigPanel
            config={systemConfig}
            onSave={handleSaveConfig} />

        </div>);

    }

    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Icon name="Construction" size={32} className="text-primary" />
        </div>
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">
          Sección en Desarrollo
        </h3>
        <p className="text-sm md:text-base font-caption text-muted-foreground text-center max-w-md">
          Esta funcionalidad estará disponible próximamente
        </p>
      </div>);

  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />


      <div
        className={`
          transition-smooth
          ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}
        `}>

        <header className="sticky top-0 z-40 bg-card border-b border-border shadow-elevation-1">
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
                Administración
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <NotificationCenter />
              <UserProfileHeader onLogout={handleLogout} />
            </div>
          </div>
        </header>

        <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <Breadcrumb />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-2">
              <NavigationTree
                activeSection={activeSection}
                onSectionChange={setActiveSection} />

            </div>

            <div className="lg:col-span-7">
              {renderContent()}
            </div>

            <div className="lg:col-span-3">
              <ActivityLogPanel />
            </div>
          </div>
        </main>
      </div>

      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={modalMode} />

      <RolePermissionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSave={handleSaveRole}
        role={selectedRole}
        mode={modalMode}
      />

      <SkillManagementModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onSave={handleSaveSkill}
        skill={selectedSkill}
        mode={modalMode}
      />

      <SystemRolesModal
        isOpen={isSystemRolesModalOpen}
        onClose={() => setIsSystemRolesModalOpen(false)}
      />

      <SystemSkillsModal
        isOpen={isSystemSkillsModalOpen}
        onClose={() => setIsSystemSkillsModalOpen(false)}
      />

    </div>);

};

export default TeamAndSystemAdministration;