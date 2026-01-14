import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeed = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    const icons = {
      status_change: 'RefreshCw',
      assignment: 'UserPlus',
      comment: 'MessageSquare',
      mention: 'AtSign',
      priority_change: 'AlertCircle',
      created: 'Plus',
      updated: 'Edit'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      status_change: 'text-primary bg-primary/10',
      assignment: 'text-success bg-success/10',
      comment: 'text-accent bg-accent/10',
      mention: 'text-warning bg-warning/10',
      priority_change: 'text-error bg-error/10',
      created: 'text-success bg-success/10',
      updated: 'text-primary bg-primary/10'
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
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {activities?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon name="Activity" size={48} className="text-muted-foreground mb-3" />
            <p className="text-sm font-caption text-muted-foreground text-center">
              No hay actividad reciente
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div
                key={activity?.id}
                className="flex gap-3 p-3 rounded-lg hover:bg-muted/30 transition-smooth"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.activityType)}`}>
                  <Icon name={getActivityIcon(activity?.activityType)} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-caption font-medium text-foreground">
                      {activity?.description}
                    </p>
                    <span className="text-xs font-caption text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(activity?.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Image
                      src={activity?.user?.avatar}
                      alt={`Avatar de ${activity?.user?.name}`}
                      className="w-5 h-5 rounded-full object-cover border border-border"
                    />
                    <span className="text-xs font-caption text-muted-foreground">
                      {activity?.user?.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
