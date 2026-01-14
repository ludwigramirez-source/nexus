import React, { useState, useEffect } from 'react';
import { activityLogsService } from '../../../services/activityLogsService';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const ActivityLogPanel = () => {
  const [filter, setFilter] = useState('all');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivities();
    // Refresh every 30 seconds
    const interval = setInterval(fetchRecentActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      const logs = await activityLogsService.getRecent(5);

      // Transform backend format to component format
      const transformedLogs = logs.map((log) => ({
        id: log.id,
        type: mapActionToType(log.action),
        action: log.action,
        description: log.description,
        timestamp: log.createdAt,
        userName: log.userName || 'Sistema',
        userAvatar: log.user?.avatar || null,
        userAvatarAlt: log.userName,
        targetUser: log.metadata?.targetUser,
      }));

      setActivities(transformedLogs);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const mapActionToType = (action) => {
    const typeMap = {
      'LOGIN': 'user',
      'LOGOUT': 'user',
      'REGISTER': 'user',
      'CREATE': 'user',
      'UPDATE': 'edit',
      'DELETE': 'delete',
      'STATUS_CHANGE': 'config',
    };
    return typeMap[action] || 'system';
  };

  const filterOptions = [
    { value: 'all', label: 'Todas las actividades' },
    { value: 'user', label: 'Gestión de usuarios' },
    { value: 'config', label: 'Configuración' },
    { value: 'system', label: 'Sistema' }
  ];

  const filteredActivities = filter === 'all'
    ? activities
    : activities?.filter(activity => activity?.type === filter);

  const getActivityIcon = (type) => {
    const icons = {
      user: 'UserPlus',
      edit: 'Edit',
      delete: 'Trash2',
      config: 'Settings',
      system: 'Server'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      user: 'text-success bg-success/10',
      edit: 'text-primary bg-primary/10',
      delete: 'text-error bg-error/10',
      config: 'text-amber-600 bg-amber-600/10',
      system: 'text-purple-600 bg-purple-600/10'
    };
    return colors?.[type] || 'text-muted-foreground bg-muted';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Ahora mismo';
    } else if (diffMins < 60) {
      return `Hace ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours}h`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays}d`;
    } else {
      return date?.toLocaleDateString('es-MX', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1 h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Registro de Actividad
          </h3>
          <Icon name="Activity" size={20} className="text-muted-foreground" />
        </div>
        <Select
          options={filterOptions}
          value={filter}
          onChange={setFilter}
          placeholder="Filtrar actividades"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon name="Loader2" size={48} className="text-primary animate-spin mb-3" />
            <p className="text-sm font-caption text-muted-foreground text-center">
              Cargando actividades...
            </p>
          </div>
        ) : filteredActivities?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon name="FileText" size={48} className="text-muted-foreground mb-3" />
            <p className="text-sm font-caption text-muted-foreground text-center">
              No hay actividades recientes
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities?.map((activity) => (
              <div
                key={activity?.id}
                className="flex gap-3 p-3 rounded-lg hover:bg-muted/30 transition-smooth"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
                  <Icon name={getActivityIcon(activity?.type)} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-caption font-medium text-foreground">
                      {activity?.action}
                    </p>
                    <span className="text-xs font-caption text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(activity?.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm font-caption text-muted-foreground line-clamp-2 mb-2">
                    {activity?.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon name="User" size={12} className="text-primary" />
                      </div>
                      <span className="text-xs font-caption text-muted-foreground">
                        {activity?.userName}
                      </span>
                    </div>
                    {activity?.targetUser && (
                      <>
                        <Icon name="ArrowRight" size={12} className="text-muted-foreground" />
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                            <Icon name="UserCheck" size={12} className="text-amber-600" />
                          </div>
                          <span className="text-xs font-caption text-muted-foreground">
                            {activity?.targetUser?.name}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border bg-muted/30">
        <p className="text-xs font-caption text-muted-foreground text-center">
          Mostrando {filteredActivities?.length} de {activities?.length} actividades
        </p>
      </div>
    </div>
  );
};

export default ActivityLogPanel;