import api from './api';

export const systemConfigService = {
  // ============================================
  // ROLES
  // ============================================

  async getAllRoles() {
    try {
      const { data } = await api.get('/system-config/roles');
      return data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  async createRole(roleData) {
    try {
      const { data } = await api.post('/system-config/roles', roleData);
      return data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  async updateRole(id, roleData) {
    try {
      const { data } = await api.put(`/system-config/roles/${id}`, roleData);
      return data;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  async deleteRole(id) {
    try {
      const { data } = await api.delete(`/system-config/roles/${id}`);
      return data;
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  },

  // ============================================
  // SKILLS
  // ============================================

  async getAllSkills() {
    try {
      const { data } = await api.get('/system-config/skills');
      return data;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  },

  async createSkill(skillData) {
    try {
      const { data } = await api.post('/system-config/skills', skillData);
      return data;
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  },

  async updateSkill(id, skillData) {
    try {
      const { data } = await api.put(`/system-config/skills/${id}`, skillData);
      return data;
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  },

  async deleteSkill(id) {
    try {
      const { data } = await api.delete(`/system-config/skills/${id}`);
      return data;
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  },
};
