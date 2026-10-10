import { ORG_DEPARTMENTS } from '../../../shared/dev/org-units';
import type {
  CreateUserInput,
  UserListQuery,
  UserListResult,
  UserRecord,
  UserRole,
  UsersApi,
  UserStatus,
} from '../types/users.types';
import { ACCESS_LEVELS, USER_ROLES } from '../types/users.types';

const SIMULATED_LATENCY_MS = 300;
const PAGE_SIZE = 10;
const SEED_COUNT = 26;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

const PEOPLE = [
  { name: 'Olivia Rhye', email: 'olivia@untitledui.com' },
  { name: 'Phoenix Baker', email: 'phoenix@untitledui.com' },
  { name: 'Lana Steiner', email: 'lana@untitledui.com' },
  { name: 'Demi Wilkinson', email: 'demi@untitledui.com' },
  { name: 'Candice Wu', email: 'candice@untitledui.com' },
  { name: 'Natali Craig', email: 'natali@untitledui.com' },
  { name: 'Kelechi David Eze', email: 'kelechi@gov.org' },
];

const DEPARTMENTS = ORG_DEPARTMENTS.map((department) => department.name);
const ROLE_VALUES = USER_ROLES.map((role) => role.value);
const STATUSES: UserStatus[] = ['active', 'in-active'];

function makeRow(index: number): UserRecord {
  const person = PEOPLE[index % PEOPLE.length];
  return {
    id: `user-${index}`,
    name: person.name,
    email: person.email,
    role: ROLE_VALUES[index % ROLE_VALUES.length],
    accessLevel: ACCESS_LEVELS[index % ACCESS_LEVELS.length],
    department: DEPARTMENTS[index % DEPARTMENTS.length],
    status: STATUSES[index % 3 === 1 ? 1 : 0],
    lastLogin: `2022-01-${String(14 - (index % 4)).padStart(2, '0')}`,
  };
}

/**
 * In-memory record store so mutations stay visible across list calls
 * during a session. Generated fixtures only.
 */
let rows: UserRecord[] = Array.from({ length: SEED_COUNT }, (_, i) =>
  makeRow(i),
);
let nextId = SEED_COUNT;

function matchesQuery(row: UserRecord, query: UserListQuery): boolean {
  const q = (query.query ?? '').trim().toLowerCase();
  if (
    q &&
    !row.name.toLowerCase().includes(q) &&
    !row.email.toLowerCase().includes(q) &&
    !row.department.toLowerCase().includes(q)
  ) {
    return false;
  }
  if (query.status && row.status !== query.status) return false;
  if (query.role && row.role !== query.role) return false;
  if (query.department && row.department !== query.department) return false;
  if (query.from && row.lastLogin < query.from) return false;
  if (query.to && row.lastLogin > query.to) return false;
  return true;
}

function sortRows(rows: UserRecord[], sort?: 'asc' | 'desc'): UserRecord[] {
  const direction = sort === 'asc' ? 1 : -1;
  return [...rows].sort(
    (a, b) => direction * a.lastLogin.localeCompare(b.lastLogin),
  );
}

/**
 * Development-only user fixtures used when no VITE_API_BASE_URL is
 * configured. Records are generated, not real data.
 */
export const devUsersApi: UsersApi = {
  async list(query: UserListQuery): Promise<UserListResult> {
    await delay();
    const filtered = sortRows(
      rows.filter((row) => matchesQuery(row, query)),
      query.sort,
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const page = Math.min(Math.max(1, query.page), totalPages);
    const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return { items, page, totalPages, total: filtered.length };
  },

  async listFormOptions() {
    await delay();
    return { departments: DEPARTMENTS };
  },

  async create(input: CreateUserInput): Promise<UserRecord> {
    await delay();
    const record: UserRecord = {
      id: `user-${nextId++}`,
      name: input.fullName,
      email: input.email,
      role: input.role,
      accessLevel: input.accessLevel,
      department: input.department,
      status: 'active',
      lastLogin: new Date().toISOString().slice(0, 10),
    };
    rows = [record, ...rows];
    return record;
  },

  async assignRole(userId: string, role: UserRole): Promise<void> {
    await delay();
    rows = rows.map((row) => (row.id === userId ? { ...row, role } : row));
  },

  async deactivate(userId: string): Promise<void> {
    await delay();
    rows = rows.map((row) =>
      row.id === userId ? { ...row, status: 'in-active' } : row,
    );
  },

  async resetPassword(): Promise<void> {
    await delay();
  },

  async forwardUser(): Promise<void> {
    await delay();
  },

  async approveUser(userId: string): Promise<void> {
    await delay();
    rows = rows.map((row) =>
      row.id === userId ? { ...row, status: 'active' } : row,
    );
  },
};
