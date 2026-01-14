import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { activityLogService } from '../../../services/activityLogService';

const ActivityLogSidebar = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const result = await activityLogService.getRecent();
      if (result.success) {
        setActivities(result.data?.logs || []);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action) => {
    if (action?.includes('create')) return 'Plus';
    if (action?.includes('update')) return 'Edit';
    if (action?.includes('delete')) return 'Trash2';
    return 'Activity';
  };

  const getActivityColor = (action) => {
    if (action?.includes('create')) return 'text-success';
    if (action?.includes('update')) return 'text-primary';
    if (action?.includes('delete')) return 'text-error';
    return 'text-muted-foreground';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInSeconds = Math.floor((now - activityDate) / 1000);

    if (diffInSeconds < 60) return 'Hace un momento';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
    return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
  };

  return (
    <div className="bg-card border-l border-border w-80 h-full overflow-y-auto">
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={18} className="text-primary" />
          <h3 className="text-sm font-heading font-semibold text-foreground">
            Actividad Reciente
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Inbox" size={32} className="text-muted-foreground mb-2 opacity-50 mx-auto" />
            <p className="text-xs text-muted-foreground">
              No hay actividad reciente
            </p>
          </div>
        ) : (
          activities.slice(0, 20).map((activity) => (
            <div
              key={activity?.id}
              className="flex items-start space-x-3 pb-3 border-b border-border last:border-0"
            >
              <div className={`flex-shrink-0 ${getActivityColor(activity?.action)}`}>
                <Icon name={getActivityIcon(activity?.action)} size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground font-medium truncate">
                  {activity?.userName || 'Usuario'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity?.description}
                </p>
                {activity?.details && (
                  <p className="text-xs text-muted-foreground/70 mt-1 italic truncate">
                    {activity?.details}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {formatTimeAgo(activity?.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLogSidebar;
