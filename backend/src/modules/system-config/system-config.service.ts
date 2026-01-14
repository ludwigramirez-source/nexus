import prisma from '../../config/database';
import { AppError } from '../../utils/errors.util';
import { clearRolesCache } from '../../utils/role-validator.util';
import logger from '../../config/logger';
import type {
  RoleConfig,
  CreateRoleDTO,
  UpdateRoleDTO,
  SkillConfig,
  CreateSkillDTO,
  UpdateSkillDTO,
  CompanyConfig,
  UpdateCompanyConfigDTO,
} from './system-config.types';

const ROLES_CONFIG_KEY = 'system_roles';
const SKILLS_CONFIG_KEY = 'system_skills';
const COMPANY_CONFIG_KEY = 'company_config';
const GENERAL_CONFIG_KEY = 'general_config';
const PRODUCTS_CONFIG_KEY = 'products_config';
const CLIENTS_CONFIG_KEY = 'clients_config';
const OKRS_CONFIG_KEY = 'okrs_config';

export class SystemConfigService {
  // ============================================
  // ROLES
  // ============================================

  /**
   * Get all roles
   */
  static async getAllRoles(): Promise<RoleConfig[]> {
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key: ROLES_CONFIG_KEY },
      });

      if (!config) {
        // Create default roles if config doesn't exist
        const defaultRoles = this.getDefaultRoles();
        await prisma.systemConfig.create({
          data: {
            key: ROLES_CONFIG_KEY,
            value: defaultRoles,
          },
        });
        logger.info('Default roles created in database');
        return defaultRoles;
      }

      return config.value as RoleConfig[];
    } catch (error) {
      logger.error('Error getting roles:', error);
      throw error;
    }
  }

  /**
   * Create a new role
   */
  static async createRole(data: CreateRoleDTO): Promise<RoleConfig> {
    try {
      const roles = await this.getAllRoles();

      // Check if role name already exists
      if (roles.some((r) => r.name.toLowerCase() === data.name.toLowerCase())) {
        throw new AppError('Role with this name already exists', 409);
      }

      const newRole: RoleConfig = {
        id: this.generateId(),
        name: data.name,
        label: data.label,
        description: data.description,
        isSystem: false,
      };

      const updatedRoles = [...roles, newRole];

      await prisma.systemConfig.upsert({
        where: { key: ROLES_CONFIG_KEY },
        update: { value: updatedRoles },
        create: { key: ROLES_CONFIG_KEY, value: updatedRoles },
      });

      // Clear roles cache to force reload
      clearRolesCache();

      logger.info(`Role created: ${data.name}`);
      return newRole;
    } catch (error) {
      logger.error('Error creating role:', error);
      throw error;
    }
  }

  /**
   * Update a role
   */
  static async updateRole(id: string, data: UpdateRoleDTO): Promise<RoleConfig> {
    try {
      const roles = await this.getAllRoles();
      const roleIndex = roles.findIndex((r) => r.id === id);

      if (roleIndex === -1) {
        throw new AppError('Role not found', 404);
      }

      const role = roles[roleIndex];

      if (role.isSystem) {
        throw new AppError('Cannot modify system role', 400);
      }

      // Check if new name conflicts with existing role
      if (data.name) {
        const nameExists = roles.some(
          (r) => r.id !== id && r.name.toLowerCase() === data.name!.toLowerCase()
        );
        if (nameExists) {
          throw new AppError('Role with this name already exists', 409);
        }
      }

      const updatedRole: RoleConfig = {
        ...role,
        ...data,
      };

      roles[roleIndex] = updatedRole;

      await prisma.systemConfig.update({
        where: { key: ROLES_CONFIG_KEY },
        data: { value: roles },
      });

      // Clear roles cache to force reload
      clearRolesCache();

      logger.info(`Role updated: ${id}`);
      return updatedRole;
    } catch (error) {
      logger.error('Error updating role:', error);
      throw error;
    }
  }

  /**
   * Delete a role
   */
  static async deleteRole(id: string): Promise<void> {
    try {
      const roles = await this.getAllRoles();
      const role = roles.find((r) => r.id === id);

      if (!role) {
        throw new AppError('Role not found', 404);
      }

      if (role.isSystem) {
        throw new AppError('Cannot delete system role', 400);
      }

      // Check if any users have this role
      const usersWithRole = await prisma.user.count({
        where: { role: role.name as any },
      });

      if (usersWithRole > 0) {
        throw new AppError(
          `Cannot delete role. ${usersWithRole} user(s) are assigned this role.`,
          400
        );
      }

      const updatedRoles = roles.filter((r) => r.id !== id);

      await prisma.systemConfig.update({
        where: { key: ROLES_CONFIG_KEY },
        data: { value: updatedRoles },
      });

      // Clear roles cache to force reload
      clearRolesCache();

      logger.info(`Role deleted: ${id}`);
    } catch (error) {
      logger.error('Error deleting role:', error);
      throw error;
    }
  }

  // ============================================
  // SKILLS
  // ============================================

  /**
   * Get all skills
   */
  static async getAllSkills(): Promise<SkillConfig[]> {
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key: SKILLS_CONFIG_KEY },
      });

      if (!config) {
        // Create default skills if config doesn't exist
        const defaultSkills = this.getDefaultSkills();
        await prisma.systemConfig.create({
          data: {
            key: SKILLS_CONFIG_KEY,
            value: defaultSkills,
          },
        });
        logger.info('Default skills created in database');
        return defaultSkills;
      }

      return config.value as SkillConfig[];
    } catch (error) {
      logger.error('Error getting skills:', error);
      throw error;
    }
  }

  /**
   * Create a new skill
   */
  static async createSkill(data: CreateSkillDTO): Promise<SkillConfig> {
    try {
      const skills = await this.getAllSkills();

      // Check if skill name already exists
      if (skills.some((s) => s.name.toLowerCase() === data.name.toLowerCase())) {
        throw new AppError('Skill with this name already exists', 409);
      }

      const newSkill: SkillConfig = {
        id: this.generateId(),
        name: data.name,
        description: data.description,
        category: data.category,
      };

      const updatedSkills = [...skills, newSkill];

      await prisma.systemConfig.upsert({
        where: { key: SKILLS_CONFIG_KEY },
        update: { value: updatedSkills },
        create: { key: SKILLS_CONFIG_KEY, value: updatedSkills },
      });

      logger.info(`Skill created: ${data.name}`);
      return newSkill;
    } catch (error) {
      logger.error('Error creating skill:', error);
      throw error;
    }
  }

  /**
   * Update a skill
   */
  static async updateSkill(id: string, data: UpdateSkillDTO): Promise<SkillConfig> {
    try {
      const skills = await this.getAllSkills();
      const skillIndex = skills.findIndex((s) => s.id === id);

      if (skillIndex === -1) {
        throw new AppError('Skill not found', 404);
      }

      // Check if new name conflicts with existing skill
      if (data.name) {
        const nameExists = skills.some(
          (s) => s.id !== id && s.name.toLowerCase() === data.name!.toLowerCase()
        );
        if (nameExists) {
          throw new AppError('Skill with this name already exists', 409);
        }
      }

      const updatedSkill: SkillConfig = {
        ...skills[skillIndex],
        ...data,
      };

      skills[skillIndex] = updatedSkill;

      await prisma.systemConfig.update({
        where: { key: SKILLS_CONFIG_KEY },
        data: { value: skills },
      });

      logger.info(`Skill updated: ${id}`);
      return updatedSkill;
    } catch (error) {
      logger.error('Error updating skill:', error);
      throw error;
    }
  }

  /**
   * Delete a skill
   */
  static async deleteSkill(id: string): Promise<void> {
    try {
      const skills = await this.getAllSkills();
      const skill = skills.find((s) => s.id === id);

      if (!skill) {
        throw new AppError('Skill not found', 404);
      }

      const updatedSkills = skills.filter((s) => s.id !== id);

      await prisma.systemConfig.update({
        where: { key: SKILLS_CONFIG_KEY },
        data: { value: updatedSkills },
      });

      logger.info(`Skill deleted: ${id}`);
    } catch (error) {
      logger.error('Error deleting skill:', error);
      throw error;
    }
  }

  // ============================================
  // COMPANY CONFIGURATION
  // ============================================

  /**
   * Get company configuration
   */
  static async getCompanyConfig(): Promise<CompanyConfig> {
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key: COMPANY_CONFIG_KEY },
      });

      if (!config) {
        // Create default company config if doesn't exist
        const defaultConfig = this.getDefaultCompanyConfig();
        await prisma.systemConfig.create({
          data: {
            key: COMPANY_CONFIG_KEY,
            value: defaultConfig,
          },
        });
        logger.info('Default company config created in database');
        return defaultConfig;
      }

      return config.value as CompanyConfig;
    } catch (error) {
      logger.error('Error getting company config:', error);
      throw error;
    }
  }

  /**
   * Update company configuration
   */
  static async updateCompanyConfig(data: UpdateCompanyConfigDTO): Promise<CompanyConfig> {
    try {
      const currentConfig = await this.getCompanyConfig();

      const updatedConfig: CompanyConfig = {
        ...currentConfig,
        ...data,
      };

      await prisma.systemConfig.upsert({
        where: { key: COMPANY_CONFIG_KEY },
        update: { value: updatedConfig },
        create: { key: COMPANY_CONFIG_KEY, value: updatedConfig },
      });

      logger.info('Company config updated');
      return updatedConfig;
    } catch (error) {
      logger.error('Error updating company config:', error);
      throw error;
    }
  }

  /**
   * Update company logo
   */
  static async updateCompanyLogo(logoData: { url: string; fileName: string }): Promise<CompanyConfig> {
    try {
      const currentConfig = await this.getCompanyConfig();

      const updatedConfig: CompanyConfig = {
        ...currentConfig,
        logo: {
          url: logoData.url,
          fileName: logoData.fileName,
          uploadedAt: new Date(),
        },
      };

      await prisma.systemConfig.update({
        where: { key: COMPANY_CONFIG_KEY },
        data: { value: updatedConfig },
      });

      logger.info('Company logo updated');
      return updatedConfig;
    } catch (error) {
      logger.error('Error updating company logo:', error);
      throw error;
    }
  }

  // ============================================
  // GENERAL CONFIGURATION METHODS
  // ============================================

  /**
   * Get any configuration by key
   */
  static async getConfig(key: string): Promise<any> {
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key },
      });

      return config?.value || null;
    } catch (error) {
      logger.error(`Error getting config ${key}:`, error);
      throw error;
    }
  }

  /**
   * Update any configuration by key
   */
  static async updateConfig(key: string, value: any): Promise<any> {
    try {
      await prisma.systemConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });

      logger.info(`Config updated: ${key}`);
      return value;
    } catch (error) {
      logger.error(`Error updating config ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get general configuration
   */
  static async getGeneralConfig(): Promise<any> {
    return this.getConfig(GENERAL_CONFIG_KEY);
  }

  /**
   * Update general configuration
   */
  static async updateGeneralConfig(data: any): Promise<any> {
    return this.updateConfig(GENERAL_CONFIG_KEY, data);
  }

  /**
   * Get products configuration
   */
  static async getProductsConfig(): Promise<any> {
    return this.getConfig(PRODUCTS_CONFIG_KEY);
  }

  /**
   * Update products configuration
   */
  static async updateProductsConfig(data: any): Promise<any> {
    return this.updateConfig(PRODUCTS_CONFIG_KEY, data);
  }

  /**
   * Get clients configuration
   */
  static async getClientsConfig(): Promise<any> {
    return this.getConfig(CLIENTS_CONFIG_KEY);
  }

  /**
   * Update clients configuration
   */
  static async updateClientsConfig(data: any): Promise<any> {
    return this.updateConfig(CLIENTS_CONFIG_KEY, data);
  }

  /**
   * Get OKRs configuration
   */
  static async getOkrsConfig(): Promise<any> {
    return this.getConfig(OKRS_CONFIG_KEY);
  }

  /**
   * Update OKRs configuration
   */
  static async updateOkrsConfig(data: any): Promise<any> {
    return this.updateConfig(OKRS_CONFIG_KEY, data);
  }

  /**
   * Get all system configuration
   */
  static async getAllConfig(): Promise<any> {
    try {
      const general = await this.getGeneralConfig();
      const products = await this.getProductsConfig();
      const clients = await this.getClientsConfig();
      const company = await this.getCompanyConfig();
      const okrs = await this.getOkrsConfig();

      return {
        general,
        products,
        clients,
        company,
        okrs,
      };
    } catch (error) {
      logger.error('Error getting all config:', error);
      throw error;
    }
  }

  // ============================================
  // HELPERS
  // ============================================

  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getDefaultRoles(): RoleConfig[] {
    return [
      {
        id: 'role-ceo',
        name: 'CEO',
        label: 'CEO',
        description: 'Chief Executive Officer',
        isSystem: true,
      },
      {
        id: 'role-dev-director',
        name: 'DEV_DIRECTOR',
        label: 'Director de Desarrollo',
        description: 'Director of Development',
        isSystem: true,
      },
      {
        id: 'role-backend',
        name: 'BACKEND',
        label: 'Desarrollador Backend',
        description: 'Backend Developer',
        isSystem: true,
      },
      {
        id: 'role-frontend',
        name: 'FRONTEND',
        label: 'Desarrollador Frontend',
        description: 'Frontend Developer',
        isSystem: true,
      },
      {
        id: 'role-fullstack',
        name: 'FULLSTACK',
        label: 'Desarrollador Full Stack',
        description: 'Full Stack Developer',
        isSystem: true,
      },
      {
        id: 'role-soporte-voip',
        name: 'SOPORTE_VOIP',
        label: 'Soporte VoIP',
        description: 'VoIP Support Specialist',
        isSystem: true,
      },
    ];
  }

  private static getDefaultSkills(): SkillConfig[] {
    return [
      // Frontend
      { id: 'skill-1', name: 'React', description: 'React framework', category: 'Frontend' },
      { id: 'skill-2', name: 'Vue.js', description: 'Vue.js framework', category: 'Frontend' },
      { id: 'skill-3', name: 'Angular', description: 'Angular framework', category: 'Frontend' },
      { id: 'skill-4', name: 'HTML/CSS', description: 'HTML y CSS', category: 'Frontend' },
      { id: 'skill-5', name: 'JavaScript', description: 'JavaScript language', category: 'Frontend' },
      { id: 'skill-6', name: 'Tailwind CSS', description: 'Utility-first CSS framework', category: 'Frontend' },

      // Backend
      { id: 'skill-7', name: 'Node.js', description: 'Node.js runtime', category: 'Backend' },
      { id: 'skill-8', name: 'Express', description: 'Express.js framework', category: 'Backend' },
      { id: 'skill-9', name: 'NestJS', description: 'NestJS framework', category: 'Backend' },
      { id: 'skill-10', name: 'Python', description: 'Python language', category: 'Backend' },
      { id: 'skill-11', name: 'Django', description: 'Django framework', category: 'Backend' },
      { id: 'skill-12', name: 'FastAPI', description: 'FastAPI framework', category: 'Backend' },
      { id: 'skill-13', name: 'PHP', description: 'PHP language', category: 'Backend' },
      { id: 'skill-14', name: 'Laravel', description: 'Laravel framework', category: 'Backend' },

      // Language
      { id: 'skill-15', name: 'TypeScript', description: 'TypeScript language', category: 'Language' },
      { id: 'skill-16', name: 'Java', description: 'Java language', category: 'Language' },
      { id: 'skill-17', name: 'C#', description: 'C# language', category: 'Language' },
      { id: 'skill-18', name: 'Go', description: 'Go language', category: 'Language' },
      { id: 'skill-19', name: 'Rust', description: 'Rust language', category: 'Language' },

      // Database
      { id: 'skill-20', name: 'PostgreSQL', description: 'PostgreSQL database', category: 'Database' },
      { id: 'skill-21', name: 'MySQL', description: 'MySQL database', category: 'Database' },
      { id: 'skill-22', name: 'MongoDB', description: 'MongoDB NoSQL database', category: 'Database' },
      { id: 'skill-23', name: 'Redis', description: 'Redis cache', category: 'Database' },
      { id: 'skill-24', name: 'Prisma', description: 'Prisma ORM', category: 'Database' },
      { id: 'skill-25', name: 'SQL Server', description: 'Microsoft SQL Server', category: 'Database' },

      // DevOps
      { id: 'skill-26', name: 'Docker', description: 'Docker containers', category: 'DevOps' },
      { id: 'skill-27', name: 'Kubernetes', description: 'Container orchestration', category: 'DevOps' },
      { id: 'skill-28', name: 'AWS', description: 'Amazon Web Services', category: 'DevOps' },
      { id: 'skill-29', name: 'Azure', description: 'Microsoft Azure', category: 'DevOps' },
      { id: 'skill-30', name: 'GCP', description: 'Google Cloud Platform', category: 'DevOps' },
      { id: 'skill-31', name: 'CI/CD', description: 'Continuous Integration/Deployment', category: 'DevOps' },
      { id: 'skill-32', name: 'Linux', description: 'Linux operating system', category: 'DevOps' },
      { id: 'skill-33', name: 'Nginx', description: 'Nginx web server', category: 'DevOps' },

      // Tools
      { id: 'skill-34', name: 'Git', description: 'Version control', category: 'Tools' },
      { id: 'skill-35', name: 'GitHub', description: 'GitHub platform', category: 'Tools' },
      { id: 'skill-36', name: 'GitLab', description: 'GitLab platform', category: 'Tools' },
      { id: 'skill-37', name: 'Jira', description: 'Project management', category: 'Tools' },
      { id: 'skill-38', name: 'VS Code', description: 'Visual Studio Code', category: 'Tools' },

      // Mobile
      { id: 'skill-39', name: 'React Native', description: 'React Native framework', category: 'Mobile' },
      { id: 'skill-40', name: 'Flutter', description: 'Flutter framework', category: 'Mobile' },
      { id: 'skill-41', name: 'Swift', description: 'Swift for iOS', category: 'Mobile' },
      { id: 'skill-42', name: 'Kotlin', description: 'Kotlin for Android', category: 'Mobile' },

      // Testing
      { id: 'skill-43', name: 'Jest', description: 'Jest testing framework', category: 'Testing' },
      { id: 'skill-44', name: 'Cypress', description: 'Cypress E2E testing', category: 'Testing' },
      { id: 'skill-45', name: 'Playwright', description: 'Playwright testing', category: 'Testing' },
      { id: 'skill-46', name: 'Unit Testing', description: 'Unit testing', category: 'Testing' },

      // Other
      { id: 'skill-47', name: 'GraphQL', description: 'GraphQL query language', category: 'API' },
      { id: 'skill-48', name: 'REST API', description: 'RESTful API design', category: 'API' },
      { id: 'skill-49', name: 'WebSockets', description: 'Real-time communication', category: 'API' },
      { id: 'skill-50', name: 'Microservices', description: 'Microservices architecture', category: 'Architecture' },
    ];
  }

  private static getDefaultCompanyConfig(): CompanyConfig {
    return {
      quotationSigner: {
        name: 'IPTEGRA SAS',
        position: 'Gerente General',
      },
      commercialTermsTemplates: [
        {
          id: this.generateId(),
          name: 'Condiciones Estándar',
          content: 'Forma de pago: 50% anticipo, 50% contra entrega\nTiempo de entrega: Según especificaciones\nGarantía: 12 meses contra defectos de fábrica',
          isDefault: true,
        },
      ],
      observationsTemplates: [
        {
          id: this.generateId(),
          name: 'Observaciones Estándar',
          content: 'Cotización válida por 30 días\nPrecios sujetos a cambio sin previo aviso\nNo incluye instalación',
          isDefault: true,
        },
      ],
    };
  }
}
