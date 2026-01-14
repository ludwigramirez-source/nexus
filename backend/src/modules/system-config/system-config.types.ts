import { z } from 'zod';

// ============================================
// ROLES
// ============================================

export const roleConfigSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  label: z.string().min(2, 'Label must be at least 2 characters'),
  description: z.string().optional(),
  isSystem: z.boolean().default(false), // System roles cannot be deleted
});

export const createRoleSchema = roleConfigSchema.omit({ id: true });
export const updateRoleSchema = roleConfigSchema.partial().omit({ id: true, isSystem: true });

export type RoleConfig = z.infer<typeof roleConfigSchema>;
export type CreateRoleDTO = z.infer<typeof createRoleSchema>;
export type UpdateRoleDTO = z.infer<typeof updateRoleSchema>;

// ============================================
// SKILLS
// ============================================

export const skillConfigSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().optional(),
});

export const createSkillSchema = skillConfigSchema.omit({ id: true });
export const updateSkillSchema = skillConfigSchema.partial().omit({ id: true });

export type SkillConfig = z.infer<typeof skillConfigSchema>;
export type CreateSkillDTO = z.infer<typeof createSkillSchema>;
export type UpdateSkillDTO = z.infer<typeof updateSkillSchema>;

// ============================================
// RESPONSE TYPES
// ============================================

export interface RolesResponse {
  roles: RoleConfig[];
}

export interface SkillsResponse {
  skills: SkillConfig[];
}
