import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

import CommentSection from './CommentSection';
import ActivityFeed from './ActivityFeed';
import TimeTracker from './TimeTracker';
import { commentService } from '../../../services/commentService';
import { activityService } from '../../../services/activityService';
import { formatHoursCompact } from '../../../utils/timeFormat';

const RequestDetailModal = ({ request, onClose, teamMembers = [], currentUser }) => {
  const [activeTab, setActiveTab] = useState('comments');
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (request?.id) {
      loadData();
    }
  }, [request?.id]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load comments and activities independently to avoid one failing blocking the other
      let commentsData = [];
      let activitiesData = [];

      try {
        commentsData = await commentService?.getCommentsByRequestId(request?.id);
      } catch (error) {
        console.error('Error loading comments:', error);
        // Continue even if comments fail to load
      }

      try {
        activitiesData = await activityService?.getActivitiesByRequestId(request?.id);
      } catch (error) {
        console.error('Error loading activities:', error);
        // Continue even if activities fail to load
      }

      setComments(commentsData || []);
      setActivities(activitiesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (commentData) => {
    try {
      const newComment = await commentService?.createComment(
        request?.id,
        commentData?.content
      );

      // Add the new comment to the list
      if (newComment) {
        setComments(prev => [...prev, newComment]);
      }

      // Reload data to get the latest comments and activities
      await loadData();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error al agregar comentario. Por favor intenta de nuevo.');
    }
  };

  const getTypeColor = (type) => {
    const typeKey = type?.toLowerCase();
    const colors = {
      product_feature: 'bg-success/10 text-success border-success/20',
      customization: 'bg-accent/10 text-accent border-accent/20',
      bug: 'bg-error/10 text-error border-error/20',
      support: 'bg-primary/10 text-primary border-primary/20',
      infrastructure: 'bg-secondary/10 text-secondary border-secondary/20'
    };
    return colors?.[typeKey] || colors?.support;
  };

  const getTypeLabel = (type) => {
    const typeKey = type?.toLowerCase();
    const labels = {
      product_feature: 'Producto',
      customization: 'Personalización',
      bug: 'Error',
      support: 'Soporte',
      infrastructure: 'Infraestructura'
    };
    return labels?.[typeKey] || type;
  };

  const getStatusColor = (status) => {
    const statusKey = status?.toLowerCase();
    const colors = {
      intake: 'bg-secondary/10 text-secondary border-secondary/20',
      backlog: 'bg-muted text-muted-foreground',
      in_progress: 'bg-primary/10 text-primary',
      review: 'bg-accent/10 text-accent',
      done: 'bg-success/10 text-success',
      rejected: 'bg-error/10 text-error'
    };
    return colors?.[statusKey] || colors?.backlog;
  };

  const getStatusLabel = (status) => {
    const statusKey = status?.toLowerCase();
    const labels = {
      intake: 'Intake',
      backlog: 'Backlog',
      in_progress: 'En Progreso',
      review: 'En Revisión',
      done: 'Completado',
      rejected: 'Rechazado'
    };
    return labels?.[statusKey] || status;
  };

  const getPriorityIcon = (priority) => {
    const priorityKey = priority?.toLowerCase();
    const icons = {
      critical: { name: 'AlertCircle', color: 'text-error' },
      high: { name: 'ArrowUp', color: 'text-warning' },
      medium: { name: 'Minus', color: 'text-accent' },
      low: { name: 'ArrowDown', color: 'text-muted-foreground' }
    };
    return icons?.[priorityKey] || icons?.medium;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg border border-border shadow-elevation-3 w-full max-w-6xl max-h-[90vh] flex flex-col m-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {request?.requestNumber || `#${request?.id?.substring(0, 8)}`} - {request?.title}
              </h2>
              <span className={`inline-flex px-2 py-1 text-xs font-caption font-medium rounded-md border ${getTypeColor(request?.type)}`}>
                {getTypeLabel(request?.type)}
              </span>
            </div>
            <p className="text-sm font-caption text-muted-foreground">
              {request?.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-smooth flex-shrink-0 ml-4"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 border-r border-border p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-caption font-medium text-muted-foreground mb-1 block">
                    Estado
                  </label>
                  <span className={`inline-flex px-3 py-1.5 text-sm font-caption font-medium rounded-md ${getStatusColor(request?.status)}`}>
                    {getStatusLabel(request?.status)}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-caption font-medium text-muted-foreground mb-1 block">
                    Prioridad
                  </label>
                  <div className="flex items-center gap-2">
                    <Icon
                      name={getPriorityIcon(request?.priority)?.name}
                      size={18}
                      className={getPriorityIcon(request?.priority)?.color}
                    />
                    <span className="text-sm font-caption text-foreground capitalize">
                      {request?.priority}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-caption font-medium text-muted-foreground mb-1 block">
                    Asignado a
                  </label>
                  {request?.assignee ? (
                    <div className="flex items-center gap-2">
                      <Image
                        src={request?.assignee?.avatar}
                        alt={request?.assignee?.avatarAlt}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-caption text-foreground">
                        {request?.assignee?.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-caption text-muted-foreground">Sin asignar</span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-caption font-medium text-muted-foreground mb-1 block">
                    Cliente
                  </label>
                  <span className="text-sm font-caption text-foreground">
                    {request?.client?.name || '-'}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-caption font-medium text-muted-foreground mb-1 block">
                    Horas Estimadas
                  </label>
                  <span className="text-sm font-caption text-foreground">
                    {formatHoursCompact(request?.estimatedHours)}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-caption font-medium text-muted-foreground mb-1 block">
                    Horas Reales
                  </label>
                  <span className="text-sm font-caption text-foreground">
                    {formatHoursCompact(request?.actualHours || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[500px] flex flex-col">
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('comments')}
                className={`flex-1 px-4 py-3 text-sm font-caption font-medium transition-smooth ${
                  activeTab === 'comments' ?'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon name="MessageSquare" size={16} />
                  <span>Comentarios</span>
                  {comments?.length > 0 && (
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                      {comments?.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`flex-1 px-4 py-3 text-sm font-caption font-medium transition-smooth ${
                  activeTab === 'activity' ?'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon name="Activity" size={16} />
                  <span>Actividad</span>
                  {activities?.length > 0 && (
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                      {activities?.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('time')}
                className={`flex-1 px-4 py-3 text-sm font-caption font-medium transition-smooth ${
                  activeTab === 'time' ?'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon name="Clock" size={16} />
                  <span>Tiempo</span>
                </div>
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Icon name="Loader2" size={32} className="text-muted-foreground animate-spin" />
                </div>
              ) : activeTab === 'comments' ? (
                <CommentSection
                  requestId={request?.id}
                  comments={comments}
                  onAddComment={handleAddComment}
                  teamMembers={teamMembers}
                  currentUser={currentUser}
                />
              ) : activeTab === 'activity' ? (
                <ActivityFeed activities={activities} />
              ) : activeTab === 'time' ? (
                <div className="p-4 overflow-y-auto h-full">
                  <TimeTracker
                    requestId={request?.id}
                    onTimeUpdated={() => {
                      // Callback to refresh request data when time is updated
                      // This could trigger a refresh of the parent component
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailModal;
