import api from './api';

export const assignmentService = {
  // Obtener por rango de fechas
  async getByDateRange(startDate, endDate) {
    try {
      const { data } = await api.get('/assignments/by-date-range', {
        params: { startDate, endDate }
      });
      return data;
    } catch (error) {
      console.error('Error fetching assignments by date range:', error);
      throw error;
    }
  },

  // Crear múltiples asignaciones (distribución multi-día)
  async createBulk(assignmentsData) {
    try {
      const payload = {
        assignments: assignmentsData.map(a => ({
          userId: a.userId,
          requestId: a.requestId,
          assignedDate: a.assignedDate,
          allocatedHours: a.allocatedHours,
          notes: a.notes || ''
        }))
      };

      const { data } = await api.post('/assignments/bulk', payload);
      return data;
    } catch (error) {
      console.error('Error creating bulk assignments:', error);
      throw error;
    }
  },

  // Crear asignación única
  async create(assignmentData) {
    try {
      const payload = {
        userId: assignmentData.userId,
        requestId: assignmentData.requestId,
        assignedDate: assignmentData.assignedDate,
        allocatedHours: assignmentData.allocatedHours,
        notes: assignmentData.notes || ''
      };

      const { data } = await api.post('/assignments', payload);
      return data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  },

  // Actualizar asignación
  async update(id, assignmentData) {
    try {
      const payload = {
        allocatedHours: assignmentData.allocatedHours,
        notes: assignmentData.notes,
        status: assignmentData.status
      };

      const { data } = await api.put(`/assignments/${id}`, payload);
      return data;
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw error;
    }
  },

  // Eliminar asignación
  async delete(id) {
    try {
      const { data } = await api.delete(`/assignments/${id}`);
      return data;
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  },

  // Obtener capacidad diaria
  async getDailyCapacity(date) {
    try {
      const { data } = await api.get('/assignments/daily-capacity-summary', {
        params: { date }
      });
      return data;
    } catch (error) {
      console.error('Error fetching daily capacity:', error);
      throw error;
    }
  },

  // Obtener capacidad semanal
  async getWeeklyCapacity(weekStart) {
    try {
      const { data } = await api.get('/assignments/capacity-summary', {
        params: { weekStart }
      });
      return data;
    } catch (error) {
      console.error('Error fetching weekly capacity:', error);
      throw error;
    }
  },

  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.requestId) params.append('requestId', filters.requestId);
      if (filters.assignedDate) params.append('assignedDate', filters.assignedDate);
      if (filters.status) params.append('status', filters.status);

      const { data } = await api.get(`/assignments?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/assignments/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      throw error;
    }
  }
};
