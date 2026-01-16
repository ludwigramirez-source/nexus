import React, { useState, useEffect } from 'react';
import { requestService } from '../../services/requestService';
import { userService } from '../../services/userService';
import { assignmentService } from '../../services/assignmentService';
import socketService from '../../services/socketService';
import Sidebar from '../../components/ui/Sidebar';
import UserProfileHeader from '../../components/ui/UserProfileHeader';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import UnassignedRequestQueue from './components/UnassignedRequestQueue';
import WeeklyCalendarGrid from './components/WeeklyCalendarGrid';
import TeamMemberPanel from './components/TeamMemberPanel';
import FilterToolbar from './components/FilterToolbar';
import AssignmentDetailsModal from './components/AssignmentDetailsModal';
import AssignmentDistributionModal from './components/AssignmentDistributionModal';

const CapacityPlanningWorkspace = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDistributionModal, setShowDistributionModal] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState(null);  // { request, member, date }

  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    const day = monday.getDay();
    const diff = day === 0 ? -6 : 1 - day;  // Si es domingo (-6), sino (1 - día actual)
    monday.setDate(monday.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    team: 'all'
  });

  const [unassignedRequests, setUnassignedRequests] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 4);  // Viernes

        const [requestsData, usersData, assignmentsData] = await Promise.all([
          requestService.getAll(),
          userService.getAll(),
          assignmentService.getByDateRange(
            weekStart.toISOString(),
            weekEnd.toISOString()
          )
        ]);

        // Filtrar solo solicitudes planificables (excluir COMPLETED, CANCELLED)
        const planifiableRequests = (requestsData.data || []).filter(request =>
          ['INTAKE', 'BACKLOG', 'IN_PROGRESS', 'BLOCKED'].includes(request.status)
        );

        // Transformar assignments del backend al formato del frontend
        const transformed = (assignmentsData.data || []).map(a => {
          // Parsear fecha correctamente evitando problema de timezone
          const assignedDate = new Date(a.assignedDate);
          const year = assignedDate.getFullYear();
          const month = String(assignedDate.getMonth() + 1).padStart(2, '0');
          const day = String(assignedDate.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;

          return {
            id: a.id,
            requestId: a.request.id,
            requestTitle: a.request.title,
            requestType: a.request.type,
            memberId: a.user.id,
            memberName: a.user.name,
            date: dateStr,
            hours: a.allocatedHours,
            priority: a.request.priority,
            estimatedHours: a.request.estimatedHours || a.allocatedHours,
            notes: a.notes || '',
            status: a.status
          };
        });

        setAssignments(transformed);

        // Calcular horas asignadas por request
        const assignedHoursByRequest = {};
        transformed.forEach(assignment => {
          if (!assignedHoursByRequest[assignment.requestId]) {
            assignedHoursByRequest[assignment.requestId] = 0;
          }
          assignedHoursByRequest[assignment.requestId] += assignment.hours;
        });

        // Filtrar requests que NO están completamente asignadas
        const unassigned = planifiableRequests.filter(request => {
          const assignedHours = assignedHoursByRequest[request.id] || 0;
          return assignedHours < request.estimatedHours;
        });

        setUnassignedRequests(unassigned);
        setTeamMembers(usersData.data || []);
      } catch (error) {
        console.error('Error loading data:', error);
        setUnassignedRequests([]);
        setTeamMembers([]);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socketService.connect();

    const handleRequestCreated = (newRequest) => {
      if (!newRequest.assignedTo) {
        setUnassignedRequests((prev) => [newRequest, ...prev]);
      }
    };

    const handleRequestUpdated = (updatedRequest) => {
      if (updatedRequest.assignedTo) {
        setUnassignedRequests((prev) => prev.filter(r => r.id !== updatedRequest.id));
      }
    };

    const handleAssignmentCreated = (newAssignment) => {
      setAssignments((prev) => [newAssignment, ...prev]);
    };

    const handleAssignmentUpdated = (updatedAssignment) => {
      setAssignments((prev) => prev.map(a => a.id === updatedAssignment.id ? updatedAssignment : a));
    };

    socketService.on('request:created', handleRequestCreated);
    socketService.on('request:updated', handleRequestUpdated);
    socketService.on('assignment:created', handleAssignmentCreated);
    socketService.on('assignment:updated', handleAssignmentUpdated);

    return () => {
      socketService.off('request:created', handleRequestCreated);
      socketService.off('request:updated', handleRequestUpdated);
      socketService.off('assignment:created', handleAssignmentCreated);
      socketService.off('assignment:updated', handleAssignmentUpdated);
    };
  }, [weekStart]);

  useEffect(() => {
    if (teamMembers?.length > 0 && !selectedMember) {
      setSelectedMember(teamMembers?.[0]);
    }
  }, [teamMembers, selectedMember]);

  const handleDrop = (request, memberId, date) => {
    const member = teamMembers?.find(m => m?.id === memberId);
    if (!member) return;

    setPendingAssignment({ request, member, date });
    setShowDistributionModal(true);
  };

  const handleConfirmAssignment = async (assignmentsToCreate) => {
    try {
      const result = await assignmentService.createBulk(assignmentsToCreate);

      // Agregar al estado local
      const newAssignments = result.data.map(a => {
        // Parsear fecha correctamente evitando problema de timezone
        const assignedDate = new Date(a.assignedDate);
        const year = assignedDate.getFullYear();
        const month = String(assignedDate.getMonth() + 1).padStart(2, '0');
        const day = String(assignedDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        return {
          id: a.id,
          requestId: a.request.id,
          requestTitle: a.request.title,
          requestType: a.request.type,
          memberId: a.user.id,
          memberName: a.user.name,
          date: dateStr,
          hours: a.allocatedHours,
          priority: a.request.priority,
          estimatedHours: a.request.estimatedHours || a.allocatedHours,
          notes: a.notes || '',
          status: a.status
        };
      });

      const updatedAssignments = [...assignments, ...newAssignments];
      setAssignments(updatedAssignments);

      // Calcular total de horas asignadas para este request (incluyendo asignaciones previas)
      const totalAssignedForRequest = updatedAssignments
        .filter(a => a.requestId === pendingAssignment.request.id)
        .reduce((sum, a) => sum + a.hours, 0);

      // Remover de unassigned si se asignó completamente
      if (totalAssignedForRequest >= pendingAssignment.request.estimatedHours) {
        setUnassignedRequests(
          unassignedRequests.filter(r => r.id !== pendingAssignment.request.id)
        );
      }

      setShowDistributionModal(false);
      setPendingAssignment(null);
    } catch (error) {
      console.error('Error creating assignments:', error);
      alert(error.response?.data?.message || 'Error al crear asignaciones');
    }
  };

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleUpdateAssignment = async (updatedAssignment) => {
    try {
      await assignmentService.update(updatedAssignment.id, {
        allocatedHours: updatedAssignment.hours,
        notes: updatedAssignment.notes,
        status: updatedAssignment.status
      });

      setAssignments(assignments.map(a =>
        a.id === updatedAssignment.id ? updatedAssignment : a
      ));
    } catch (error) {
      console.error('Error updating assignment:', error);
      alert('Error al actualizar la asignación');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      await assignmentService.delete(assignmentId);

      const assignment = assignments.find(a => a.id === assignmentId);
      if (assignment) {
        // Re-agregar a unassigned si no hay más assignments de este request
        const remainingAssignments = assignments.filter(
          a => a.requestId === assignment.requestId && a.id !== assignmentId
        );

        if (remainingAssignments.length === 0) {
          const request = {
            id: assignment.requestId,
            title: assignment.requestTitle,
            type: assignment.requestType,
            priority: assignment.priority,
            estimatedHours: assignment.estimatedHours,
            skills: []
          };
          setUnassignedRequests([...unassignedRequests, request]);
        }
      }

      setAssignments(assignments.filter(a => a.id !== assignmentId));
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Error al eliminar la asignación');
    }
  };

  const handleSaveScenario = () => {
    const scenarioName = prompt('Nombre del escenario:');
    if (scenarioName) {
      const newScenario = {
        id: `scenario-${Date.now()}`,
        name: scenarioName,
        createdAt: new Date()?.toISOString(),
        assignments: [...assignments]
      };
      setScenarios([...scenarios, newScenario]);
    }
  };

  const handleLoadScenario = (scenarioId) => {
    const scenario = scenarios?.find(s => s?.id === scenarioId);
    if (scenario) {
      setAssignments(scenario?.assignments);
    }
  };

  const calculateWeeklyStats = (memberId) => {
    const member = teamMembers?.find(m => m?.id === memberId);
    if (!member) return { assigned: 0, available: 0 };

    const weekEnd = new Date(weekStart);
    weekEnd?.setDate(weekStart?.getDate() + 4);

    const weekAssignments = assignments?.filter(a => {
      const assignDate = new Date(a.date);
      return a?.memberId === memberId && assignDate >= weekStart && assignDate <= weekEnd;
    });

    const assigned = weekAssignments?.reduce((sum, a) => sum + a?.hours, 0);
    const available = member?.weeklyCapacity - assigned;

    return { assigned, available };
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <div className={`flex-1 flex flex-col transition-smooth ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}`}>
        <header className="h-20 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
              Planificación de Capacidad
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <NotificationCenter onMarkAsRead={() => {}} onMarkAllAsRead={() => {}} onClearAll={() => {}} />
            <UserProfileHeader onLogout={handleLogout} />
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="px-4 md:px-6 lg:px-8 py-4">
              <Breadcrumb />
            </div>

            <FilterToolbar
              filters={filters}
              onFilterChange={setFilters}
              onSaveScenario={handleSaveScenario}
              onLoadScenario={handleLoadScenario}
              scenarios={scenarios}
            />

            <div className="flex-1 flex overflow-hidden">
              <div className="w-full lg:w-1/5 overflow-hidden">
                <UnassignedRequestQueue
                  requests={unassignedRequests}
                  onDragStart={() => {}}
                  onFilterChange={setFilters}
                  filters={filters}
                />
              </div>

              <div className="hidden lg:block flex-1 overflow-hidden">
                <WeeklyCalendarGrid
                  weekStart={weekStart}
                  teamMembers={teamMembers}
                  assignments={assignments}
                  onDrop={handleDrop}
                  onAssignmentClick={handleAssignmentClick}
                  onWeekChange={setWeekStart}
                />
              </div>

              <div className="hidden lg:block w-1/5 overflow-hidden">
                <TeamMemberPanel
                  selectedMember={selectedMember}
                  weeklyStats={selectedMember ? calculateWeeklyStats(selectedMember?.id) : null}
                />
              </div>
            </div>

            <div className="lg:hidden p-4 bg-card border-t border-border">
              <div className="flex items-center justify-center gap-2 text-sm font-caption text-muted-foreground">
                <Icon name="Monitor" size={20} />
                <p>Vista de escritorio recomendada para planificación completa</p>
              </div>
            </div>
          </div>
        </main>
      </div>
      {selectedAssignment && (
        <AssignmentDetailsModal
          assignment={selectedAssignment}
          allAssignments={assignments}
          onClose={() => setSelectedAssignment(null)}
          onUpdate={handleUpdateAssignment}
          onDelete={handleDeleteAssignment}
        />
      )}
      {showDistributionModal && pendingAssignment && (
        <AssignmentDistributionModal
          request={pendingAssignment.request}
          user={pendingAssignment.member}
          initialDate={pendingAssignment.date}
          onConfirm={handleConfirmAssignment}
          onClose={() => {
            setShowDistributionModal(false);
            setPendingAssignment(null);
          }}
        />
      )}
    </div>
  );
};

export default CapacityPlanningWorkspace;