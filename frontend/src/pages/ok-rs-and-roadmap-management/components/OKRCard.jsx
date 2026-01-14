import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const OKRCard = ({ okr, onUpdate, onDelete, onAddKeyResult }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(okr?.title);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-success bg-success/10';
    if (confidence >= 50) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    return 'bg-error';
  };

  const handleSaveTitle = () => {
    onUpdate(okr?.id, { title: editedTitle });
    setIsEditing(false);
  };

  const handleKeyResultUpdate = (krId, updates) => {
    const updatedKeyResults = okr?.keyResults?.map(kr =>
      kr?.id === krId ? { ...kr, ...updates } : kr
    );
    onUpdate(okr?.id, { keyResults: updatedKeyResults });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e?.target?.value)}
                  className="flex-1 px-3 py-2 text-base font-heading font-semibold bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveTitle}
                  iconName="Check"
                  iconSize={18}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditedTitle(okr?.title);
                    setIsEditing(false);
                  }}
                  iconName="X"
                  iconSize={18}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
                  {okr?.title}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  iconName="Edit2"
                  iconSize={16}
                />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">
              <span className="text-xs md:text-sm font-caption text-muted-foreground">
                {okr?.owner}
              </span>
              <span className="text-xs md:text-sm font-caption text-muted-foreground">
                •
              </span>
              <span className="text-xs md:text-sm font-caption text-muted-foreground">
                {okr?.department}
              </span>
              <span className={`px-2 py-1 text-xs font-caption font-medium rounded ${getConfidenceColor(okr?.confidence)}`}>
                {okr?.confidence}% confianza
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
              iconSize={20}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(okr?.id)}
              iconName="Trash2"
              iconSize={18}
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-caption text-muted-foreground">
              Progreso general
            </span>
            <span className="text-sm font-caption font-medium text-foreground">
              {okr?.progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getProgressColor(okr?.progress)}`}
              style={{ width: `${okr?.progress}%` }}
            />
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-heading font-semibold text-foreground">
                Resultados clave ({okr?.keyResults?.length})
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddKeyResult(okr?.id)}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Agregar KR
              </Button>
            </div>
            {okr?.keyResults?.map((kr) => (
              <div
                key={kr?.id}
                className="p-3 md:p-4 bg-muted/50 rounded-lg space-y-2"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm font-caption text-foreground flex-1">
                    {kr?.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const updatedKeyResults = okr?.keyResults?.filter(
                        k => k?.id !== kr?.id
                      );
                      onUpdate(okr?.id, { keyResults: updatedKeyResults });
                    }}
                    iconName="X"
                    iconSize={16}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={kr?.current}
                    onChange={(e) =>
                      handleKeyResultUpdate(kr?.id, {
                        current: parseFloat(e?.target?.value)
                      })
                    }
                    className="w-20 px-2 py-1 text-sm bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm font-caption text-muted-foreground">
                    / {kr?.target} {kr?.unit}
                  </span>
                  <span className="text-sm font-caption font-medium text-foreground ml-auto">
                    {Math.round((kr?.current / kr?.target) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getProgressColor(
                      (kr?.current / kr?.target) * 100
                    )}`}
                    style={{
                      width: `${Math.min((kr?.current / kr?.target) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OKRCard;