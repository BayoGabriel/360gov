import { useDeferredValue, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAssignRole } from '../queries/users.mutations';
import { useUserList } from '../queries/users.queries';
import { USER_ROLES } from '../types/users.types';
import type {
  UserRecord,
  UserRole,
  UserSort,
  UserStatus,
} from '../types/users.types';

const STATUSES: UserStatus[] = ['active', 'in-active'];
const ROLE_VALUES = USER_ROLES.map((role) => role.value);

export interface UserFilters {
  status?: UserStatus;
  role?: UserRole;
  department?: string;
}

function parseStatus(raw: string | null): UserStatus | undefined {
  return STATUSES.includes(raw as UserStatus)
    ? (raw as UserStatus)
    : undefined;
}

function parseRole(raw: string | null): UserRole | undefined {
  return ROLE_VALUES.includes(raw as UserRole)
    ? (raw as UserRole)
    : undefined;
}

function parseSort(raw: string | null): UserSort {
  return raw === 'asc' ? 'asc' : 'desc';
}

type ParamPatch = Record<string, string | undefined>;

export function useUsersPage() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get('page')) || 1);
  const query = params.get('q') ?? '';
  const from = params.get('from') ?? undefined;
  const to = params.get('to') ?? undefined;
  const sort = parseSort(params.get('sort'));
  const filters: UserFilters = {
    status: parseStatus(params.get('status')),
    role: parseRole(params.get('role')),
    department: params.get('dept') ?? undefined,
  };
  const deferredQuery = useDeferredValue(query);

  const result = useUserList({
    page,
    query: deferredQuery,
    from,
    to,
    sort,
    ...filters,
  });
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const assignRole = useAssignRole();

  const updateParams = (patch: ParamPatch) => {
    const next = new URLSearchParams(params);
    next.delete('page');
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setParams(next);
  };

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(params);
    if (nextPage > 1) next.set('page', String(nextPage));
    else next.delete('page');
    setParams(next);
  };
  const setQuery = (q: string) => updateParams({ q: q || undefined });
  const setRange = (f: string | undefined, t: string | undefined) =>
    updateParams({ from: f, to: t });
  const setFilters = (next: UserFilters) =>
    updateParams({
      status: next.status,
      role: next.role,
      dept: next.department,
    });
  const toggleSort = () =>
    updateParams({ sort: sort === 'desc' ? 'asc' : undefined });

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = (rows: UserRecord[]) => {
    setSelected((prev) =>
      prev.size === rows.length ? new Set() : new Set(rows.map((r) => r.id)),
    );
  };

  return {
    page,
    query,
    from,
    to,
    sort,
    filters,
    selected,
    setPage,
    setQuery,
    setRange,
    setFilters,
    toggleSort,
    toggleRow,
    toggleAll,
    onRoleChange: (userId: string, role: UserRole) =>
      assignRole.mutate({ userId, role }),
    roleChangePending: assignRole.isPending,
    ...result,
  };
}
