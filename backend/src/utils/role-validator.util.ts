import prisma from '../config/database';
import { AppError } from './errors.util';
import logger from '../config/logger';

interface RoleConfig {
  id: string;
  name: string;
  label: string;
  description?: string;
  isSystem: boolean;
}

const ROLES_CACHE_KEY = 'system_roles';
let rolesCache: RoleConfig[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 60000; // 1 minute

/**
 * Get all available roles from system_config
 */
export async function getAvailableRoles(): Promise<RoleConfig[]> {
  try {
    // Check cache
    const now = Date.now();
    if (rolesCache && (now - cacheTimestamp) < CACHE_TTL) {
      return rolesCache;
    }

    // Fetch from database
    const config = await prisma.systemConfig.findUnique({
      where: { key: ROLES_CACHE_KEY },
    });

    if (!config) {
      logger.warn('Roles config not found in database');
      return [];
    }

    rolesCache = config.value as RoleConfig[];
    cacheTimestamp = now;

    return rolesCache;
  } catch (error) {
    logger.error('Error fetching roles:', error);
    return [];
  }
}

/**
 * Validate that a role exists in system_config
 */
export async function validateRole(role: string): Promise<boolean> {
  const availableRoles = await getAvailableRoles();
  return availableRoles.some((r) => r.name === role);
}

/**
 * Validate role and throw error if invalid
 */
export async function assertValidRole(role: string): Promise<void> {
  const isValid = await validateRole(role);

  if (!isValid) {
    const availableRoles = await getAvailableRoles();
    const roleNames = availableRoles.map((r) => r.name).join(', ');

    throw new AppError(
      `Invalid role: "${role}". Available roles: ${roleNames}`,
      400
    );
  }
}

/**
 * Clear the roles cache (useful after creating/updating roles)
 */
export function clearRolesCache(): void {
  rolesCache = null;
  cacheTimestamp = 0;
}
