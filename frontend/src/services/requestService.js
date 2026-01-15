import api from './api';

export const requestService = {
  // Get all requests with filters
  async getAll(filters = {}) {
    const params = new URLSearchParams();

    // Handle arrays - only send first value for now
    // Backend expects single values, not arrays
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      params.append('status', filters.status[0]);
    } else if (filters.status && !Array.isArray(filters.status)) {
      params.append('status', filters.status);
    }

    if (filters.type && Array.isArray(filters.type) && filters.type.length > 0) {
      params.append('type', filters.type[0]);
    } else if (filters.type && !Array.isArray(filters.type)) {
      params.append('type', filters.type);
    }

    if (filters.priority && Array.isArray(filters.priority) && filters.priority.length > 0) {
      params.append('priority', filters.priority[0]);
    } else if (filters.priority && !Array.isArray(filters.priority)) {
      params.append('priority', filters.priority);
    }

    if (filters.product) params.append('productId', filters.product);
    if (filters.assignee && Array.isArray(filters.assignee) && filters.assignee.length > 0) {
      params.append('assignedTo', filters.assignee[0]);
    } else if (filters.assignee && !Array.isArray(filters.assignee)) {
      params.append('assignedTo', filters.assignee);
    }
    if (filters.client && Array.isArray(filters.client) && filters.client.length > 0) {
      params.append('clientId', filters.client[0]);
    } else if (filters.client && !Array.isArray(filters.client)) {
      params.append('clientId', filters.client);
    }
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const { data } = await api.get(`/requests?${params.toString()}`);
    return data;
  },

  // Get single request
  async getById(id) {
    const { data } = await api.get(`/requests/${id}`);
    return data.data;
  },

  // Create request
  async create(requestData) {
    const { data } = await api.post('/requests', requestData);
    return data.data;
  },

  // Update request
  async update(id, requestData) {
    const { data} = await api.put(`/requests/${id}`, requestData);
    return data.data;
  },

  // Delete request
  async delete(id) {
    await api.delete(`/requests/${id}`);
  },

  // Change status
  async updateStatus(id, status, comment) {
    const { data } = await api.patch(`/requests/${id}/status`, { status, comment });
    return data.data;
  },

  // Assign users
  async assignUsers(id, userIds) {
    const { data } = await api.patch(`/requests/${id}/assign`, { userIds });
    return data.data;
  },

  // Get activities
  async getActivities(id) {
    const { data } = await api.get(`/requests/${id}/activities`);
    return data.data;
  },

  // Get comments
  async getComments(id) {
    const { data } = await api.get(`/requests/${id}/comments`);
    return data.data;
  },

  // Add comment
  async addComment(id, content, parentId) {
    const { data } = await api.post(`/requests/${id}/comments`, { content, parentId });
    return data.data;
  },
};
