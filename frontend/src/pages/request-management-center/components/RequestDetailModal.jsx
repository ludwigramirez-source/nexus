import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

import CommentSection from './CommentSection';
import ActivityFeed from './ActivityFeed';
import { commentService } from '../../../services/commentService';
import { activityService } from '../../../services/activityService';

const RequestDetailModal = ({ request, onClose, teamMembers = [], currentUser }) => {
  const [activeTab, setActiveTab] = useState('comments');
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (request?.id) {
      loadData();
      
      const unsubscribeComments = commentService?.subscribeToComments(
        request?.id,
        (newComment) => {
          setComments(prev => [...prev, newComment]);
        }
      );

      const unsubscribeActivities = activityService?.subscribeToActivities(
        request?.id,
        (newActivity) => {
          setActivities(prev => [newActivity, ...prev]);
        }
      );

      return () => {
        unsubscribeComments();
        unsubscribeActivities();
      };
    }
  }, [request?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [commentsData, activitiesData] = await Promise.all([
        commentService?.getCommentsByRequestId(request?.id),
        activityService?.getActivitiesByRequestId(request?.id)
      ]);
      setComments(commentsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (commentData) => {
    try {
      await commentService?.createComment(
        request?.id,
        currentUser?.id,
        commentData?.content,
        commentData?.mentions
      );

      if (commentData?.mentions?.length > 0) {
        await activityService?.createActivity(
          request?.id,
          currentUser?.id,
          'mention',
          `${currentUser?.name} mencionó a ${commentData?.mentions?.length} miembro(s) del equipo`,
          { mentions: commentData?.mentions }
        );
      }

      await activityService?.createActivity(
        request?.id,
        currentUser?.id,
        'comment',
        `${currentUser?.name} agregó un comentario`,
        {}
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      product_feature: 'bg-success/10 text-success border-success/20',
      customization: 'bg-accent/10 text-accent border-accent/20',
      bug: 'bg-error/10 text-error border-error/20',
      support: 'bg-primary/10 text-primary border-primary/20',
      infrastructure: 'bg-secondary/10 text-secondary border-secondary/20'
    };
    return colors?.[type] || colors?.support;
  };

  const getTypeLabel = (type) => {
    const labels = {
      product_feature: 'Producto',
      customization: 'Personalización',
      bug: 'Error',
      support: 'Soporte',
      infrastructure: 'Infraestructura'
    };
    return labels?.[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-muted text-muted-foreground',
      in_progress: 'bg-primary/10 text-primary',
      review: 'bg-accent/10 text-accent',
      completed: 'bg-success/10 text-success'
    };
    return colors?.[status] || colors?.pending;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendiente',
      in_progress: 'En Progreso',
      review: 'En Revisión',
      completed: 'Completado'
    };
    return labels?.[status] || status;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      critical: { name: 'AlertCircle', color: 'text-error' },
      high: { name: 'ArrowUp', color: 'text-warning' },
      medium: { name: 'Minus', color: 'text-accent' },
      low: { name: 'ArrowDown', color: 'text-muted-foreground' }
    };
    return icons?.[priority] || icons?.medium;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg border border-border shadow-elevation-3 w-full max-w-6xl max-h-[90vh] flex flex-col m-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-heading font-semibold text-foreground">
                #{request?.id} - {request?.title}
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
                    {request?.client}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-caption font-medium text-muted-foreground mb-1 block">
                    Horas Estimadas
                  </label>
                  <span className="text-sm font-caption text-foreground">
                    {request?.estimatedHours}h
                  </span>
                </div>
                <div>
                  <label className="text-xs font-caption font-medium text-muted-foreground mb-1 block">
                    Horas Reales
                  </label>
                  <span className="text-sm font-caption text-foreground">
                    {request?.actualHours}h
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
              ) : (
                <ActivityFeed activities={activities} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailModal;
