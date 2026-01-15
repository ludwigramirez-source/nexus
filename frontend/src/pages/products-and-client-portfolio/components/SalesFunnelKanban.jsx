import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../../../components/AppIcon';
import KanbanCard from './KanbanCard';

// Sortable Card Wrapper
const SortableCard = ({ quotation, onClick, onEmail, onDownloadPDF }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: quotation.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard
        quotation={quotation}
        onClick={onClick}
        onEmail={onEmail}
        onDownloadPDF={onDownloadPDF}
      />
    </div>
  );
};

// Kanban Column Component
const KanbanColumn = ({ column, onCardClick, onEmail, onDownloadPDF }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.status,
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD', // TODO: Handle multiple currencies
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get column color based on status
  const getColumnColor = (status) => {
    const colors = {
      SENT: 'text-blue-600 dark:text-blue-400',
      NEGOTIATING: 'text-yellow-600 dark:text-yellow-400',
      ACCEPTED: 'text-green-600 dark:text-green-400',
      CONVERTED_TO_ORDER: 'text-purple-600 dark:text-purple-400',
      REJECTED: 'text-red-600 dark:text-red-400',
      EXPIRED: 'text-gray-600 dark:text-gray-400',
    };
    return colors[status] || 'text-foreground';
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 bg-muted/30 rounded-lg p-4 transition-colors ${
        isOver ? 'bg-primary/10 ring-2 ring-primary' : ''
      }`}
    >
      {/* Column Header */}
      <div className="mb-4">
        <h3 className={`text-lg font-semibold ${getColumnColor(column.status)}`}>
          {column.label}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-bold text-foreground">
            {formatCurrency(column.totalAmount)}
          </span>
          <span className="text-sm text-muted-foreground">
            ({column.count} {column.count === 1 ? 'cotización' : 'cotizaciones'})
          </span>
        </div>
      </div>

      {/* Column Content */}
      <SortableContext
        items={column.quotations.map(q => q.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[200px]">
          {column.quotations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Icon name="Inbox" size={48} className="mb-2 opacity-30" />
              <span className="text-sm">Sin cotizaciones</span>
            </div>
          ) : (
            column.quotations.map((quotation) => (
              <SortableCard
                key={quotation.id}
                quotation={quotation}
                onClick={() => onCardClick(quotation)}
                onEmail={onEmail}
                onDownloadPDF={onDownloadPDF}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

// Main Sales Funnel Kanban Component
const SalesFunnelKanban = ({
  kanbanData,
  loading,
  onCardClick,
  onStatusChange,
  onEmail,
  onDownloadPDF,
}) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Activate drag after 8px movement
      },
    })
  );

  const activeQuotation = useMemo(() => {
    if (!activeId || !kanbanData?.columns) return null;

    for (const column of kanbanData.columns) {
      const quotation = column.quotations.find(q => q.id === activeId);
      if (quotation) return quotation;
    }
    return null;
  }, [activeId, kanbanData]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeQuotationData = activeQuotation;
    if (!activeQuotationData) return;

    // The over.id is either a column status (droppable) or a quotation id (sortable)
    let targetStatus = over.id;

    // If over.id is not a valid status, find which column contains this quotation
    const validStatuses = ['SENT', 'NEGOTIATING', 'ACCEPTED', 'CONVERTED_TO_ORDER', 'REJECTED', 'EXPIRED'];
    if (!validStatuses.includes(over.id)) {
      // over.id is a quotation id, find its column
      for (const column of kanbanData.columns) {
        if (column.quotations.find(q => q.id === over.id)) {
          targetStatus = column.status;
          break;
        }
      }
    }

    if (!targetStatus || targetStatus === activeQuotationData.status) return;

    // Call the status change handler
    onStatusChange(activeQuotationData.id, targetStatus);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" size={48} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!kanbanData || !kanbanData.columns) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Icon name="AlertCircle" size={48} className="mb-4 opacity-30" />
        <span className="text-lg">Error al cargar datos del funnel</span>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {kanbanData.columns.map((column) => (
          <KanbanColumn
            key={column.status}
            column={column}
            onCardClick={onCardClick}
            onEmail={onEmail}
            onDownloadPDF={onDownloadPDF}
          />
        ))}
      </div>

      <DragOverlay>
        {activeQuotation ? (
          <div className="rotate-3 opacity-80">
            <KanbanCard
              quotation={activeQuotation}
              onClick={() => {}}
              onEmail={() => {}}
              onDownloadPDF={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SalesFunnelKanban;
