export type UserStatus = 'active' | 'in-active';

export type UserRole = 'admin' | 'super-admin' | 'member';

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'super-admin', label: 'Super Admin' },
  { value: 'member', label: 'Member' },
];

/**
 * Access-level labels offered by the add-user form. The backend contract
 * should confirm the final vocabulary.
 */
export const ACCESS_LEVELS = [
  'Full Access',
  'Department Access',
  'Unit Access',
  'Read Only',
] as const;

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  accessLevel: string;
  department: string;
  status: UserStatus;
  /** ISO 8601 date. */
  lastLogin: string;
}

export type UserAction =
  | 'deactivate'
  | 'reset-password'
  | 'assign-role'
  | 'forward'
  | 'approve';

export type UserSort = 'asc' | 'desc';

export interface UserListQuery {
  page: number;
  query?: string;
  status?: UserStatus;
  role?: UserRole;
  department?: string;
  /** ISO date (yyyy-mm-dd) bounds on lastLogin. */
  from?: string;
  to?: string;
  /** Sort direction applied to lastLogin. */
  sort?: UserSort;
  signal?: AbortSignal;
}

export interface UserListResult {
  items: UserRecord[];
  page: number;
  totalPages: number;
  total: number;
}

export interface UserFormOptions {
  departments: string[];
}

export interface CreateUserInput {
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
  accessLevel: string;
}

export interface DeactivateUserInput {
  reasonTitle: string;
  description: string;
}

export interface UsersApi {
  list(query: UserListQuery): Promise<UserListResult>;
  listFormOptions(signal?: AbortSignal): Promise<UserFormOptions>;
  create(input: CreateUserInput): Promise<UserRecord>;
  assignRole(userId: string, role: UserRole): Promise<void>;
  deactivate(userId: string, input: DeactivateUserInput): Promise<void>;
  resetPassword(userId: string): Promise<void>;
  forwardUser(userId: string): Promise<void>;
  approveUser(userId: string): Promise<void>;
}
