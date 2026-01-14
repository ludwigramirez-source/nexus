import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RoadmapTimeline = ({ features, quarters, onFeatureUpdate, onFeatureDelete }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [draggedFeature, setDraggedFeature] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'in-progress':
        return 'bg-primary text-primary-foreground';
      case 'planned':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-foreground';
    }
  };

  const handleDragStart = (e, feature) => {
    setDraggedFeature(feature);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, quarter) => {
    e?.preventDefault();
    if (draggedFeature) {
      onFeatureUpdate(draggedFeature?.id, { quarter });
      setDraggedFeature(null);
    }
  };

  const getFeaturesByQuarter = (quarter) => {
    return features?.filter((f) => f?.quarter === quarter);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {quarters?.map((quarter) => (
          <div
            key={quarter}
            className="bg-card border border-border rounded-lg overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, quarter)}
          >
            <div className="px-4 py-3 bg-muted/50 border-b border-border">
              <h3 className="text-sm md:text-base font-heading font-semibold text-foreground">
                {quarter}
              </h3>
              <p className="text-xs font-caption text-muted-foreground mt-1">
                {getFeaturesByQuarter(quarter)?.length} características
              </p>
            </div>
            <div className="p-3 space-y-3 min-h-[200px]">
              {getFeaturesByQuarter(quarter)?.map((feature) => (
                <div
                  key={feature?.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, feature)}
                  onClick={() => setSelectedFeature(feature)}
                  className={`
                    p-3 rounded-lg cursor-move transition-all duration-200
                    ${selectedFeature?.id === feature?.id
                      ? 'ring-2 ring-primary shadow-elevation-2'
                      : 'hover:shadow-elevation-1'
                    }
                    ${getStatusColor(feature?.status)}
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-caption font-medium flex-1 line-clamp-2">
                      {feature?.title}
                    </h4>
                    <Icon
                      name="GripVertical"
                      size={16}
                      className="opacity-50 ml-2 flex-shrink-0"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-caption opacity-80">
                      {feature?.product}
                    </span>
                    <Icon
                      name="Flag"
                      size={12}
                      className={getPriorityColor(feature?.priority)}
                    />
                    {feature?.dependencies?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Icon name="Link" size={12} className="opacity-60" />
                        <span className="text-xs font-caption opacity-80">
                          {feature?.dependencies?.length}
                        </span>
                      </div>
                    )}
                  </div>
                  {feature?.milestone && (
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-current/20">
                      <Icon name="Target" size={12} className="opacity-60" />
                      <span className="text-xs font-caption opacity-80">
                        {feature?.milestone}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {selectedFeature && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-elevation-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-4 md:px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Detalles de característica
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedFeature(null)}
                iconName="X"
                iconSize={20}
              />
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div>
                <label className="text-sm font-caption font-medium text-foreground mb-2 block">
                  Título
                </label>
                <input
                  type="text"
                  value={selectedFeature?.title}
                  onChange={(e) =>
                    setSelectedFeature({
                      ...selectedFeature,
                      title: e?.target?.value
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-caption font-medium text-foreground mb-2 block">
                  Descripción
                </label>
                <textarea
                  value={selectedFeature?.description}
                  onChange={(e) =>
                    setSelectedFeature({
                      ...selectedFeature,
                      description: e?.target?.value
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-caption font-medium text-foreground mb-2 block">
                    Estado
                  </label>
                  <select
                    value={selectedFeature?.status}
                    onChange={(e) =>
                      setSelectedFeature({
                        ...selectedFeature,
                        status: e?.target?.value
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="planned">Planeado</option>
                    <option value="in-progress">En progreso</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-caption font-medium text-foreground mb-2 block">
                    Prioridad
                  </label>
                  <select
                    value={selectedFeature?.priority}
                    onChange={(e) =>
                      setSelectedFeature({
                        ...selectedFeature,
                        priority: e?.target?.value
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  variant="default"
                  onClick={() => {
                    onFeatureUpdate(selectedFeature?.id, selectedFeature);
                    setSelectedFeature(null);
                  }}
                  iconName="Save"
                  iconPosition="left"
                  iconSize={18}
                >
                  Guardar cambios
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onFeatureDelete(selectedFeature?.id);
                    setSelectedFeature(null);
                  }}
                  iconName="Trash2"
                  iconPosition="left"
                  iconSize={18}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapTimeline;