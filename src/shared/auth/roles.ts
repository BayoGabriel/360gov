/**
 * Application roles. The backend is the authority on role membership;
 * until it sends roles, the dev auth stub assigns one from a fixed
 * email map (see features/auth/services/dev-roles.ts).
 */
export const APP_ROLES = [
  'permanent-secretary',
  'department-head',
  'staff',
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const DEFAULT_ROLE: AppRole = 'staff';
