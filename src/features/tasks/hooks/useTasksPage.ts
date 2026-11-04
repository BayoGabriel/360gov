import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../../../app/providers/auth-context';
import { DEFAULT_ROLE, isTopLevelRole } from '../../../shared/auth/roles';
import { ORG_DEPARTMENTS, ORG_UNITS } from '../../../shared/dev/org-units';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { useTaskList } from '../queries/tasks.queries';
import { TASK_PRIORITIES } from '../types/tasks.types';
import type {
  TaskPeriod,
  TaskPriority,
  TaskRecord,
  TaskScope,
  TaskStatus,
} from '../types/tasks.types';

export const TASK_PERIODS: { id: TaskPeriod; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

export interface TaskFilters {
  status?: TaskStatus;
  department?: string;
  unit?: string;
  priority?: TaskPriority;
}

export type TasksDialog =
  | { kind: 'create' | 'filter' }
  | { kind: 'edit' | 'delete' | 'view'; task: TaskRecord }
  | null;

const DEFAULT_PERIOD: TaskPeriod = 'weekly';
const PERIOD_IDS = TASK_PERIODS.map((period) => period.id);
const STATUSES: TaskStatus[] = ['to-do', 'in-progress', 'done'];
const SCOPES: TaskScope[] = ['all', 'assigned', 'created'];

export const TASK_SCOPES: { id: TaskScope; label: string }[] = [
  { id: 'all', label: 'All Tasks' },
  { id: 'assigned', label: 'Assigned to me' },
  { id: 'created', label: 'Created by me' },
];

function parsePeriod(raw: string | null): TaskPeriod {
  return PERIOD_IDS.includes(raw as TaskPeriod)
    ? (raw as TaskPeriod)
    : DEFAULT_PERIOD;
}

function parseStatus(raw: string | null): TaskStatus | undefined {
  return STATUSES.includes(raw as TaskStatus)
    ? (raw as TaskStatus)
    : undefined;
}

function parsePriority(raw: string | null): TaskPriority | undefined {
  return TASK_PRIORITIES.includes(raw as TaskPriority)
    ? (raw as TaskPriority)
    : undefined;
}

function parseScope(raw: string | null): TaskScope {
  return SCOPES.includes(raw as TaskScope) ? (raw as TaskScope) : 'all';
}

export function useTasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');
  const [dialog, setDialog] = useState<TasksDialog>(null);
  const debouncedSearch = useDebouncedValue(searchInput);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(updates)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        return next;
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
    updateParams({ q: debouncedSearch || undefined });
  }, [debouncedSearch, updateParams]);

  const { session } = useAuth();
  const user = session.status === 'authenticated' ? session.user : undefined;
  const role = user?.role ?? DEFAULT_ROLE;

  const period = parsePeriod(searchParams.get('period'));
  const status = parseStatus(searchParams.get('status'));
  const department = searchParams.get('dept') ?? undefined;
  const unit = searchParams.get('unit') ?? undefined;
  const priority = parsePriority(searchParams.get('priority'));
  const scope = parseScope(searchParams.get('scope'));
  const from = searchParams.get('from') ?? undefined;
  const to = searchParams.get('to') ?? undefined;

  // Non-top-level roles only see tasks within their org scope.
  const userDepartment = isTopLevelRole(role)
    ? undefined
    : ORG_DEPARTMENTS.find((d) => d.id === user?.departmentId)?.name;
  const userUnit = isTopLevelRole(role)
    ? undefined
    : ORG_UNITS.find((u) => u.id === user?.unitId)?.name;

  const listQuery = useTaskList({
    period,
    query: searchParams.get('q') ?? '',
    status,
    department,
    unit,
    priority,
    scope,
    me: user?.displayName,
    userDepartment,
    userUnit,
    from,
    to,
  });

  const setPeriod = (next: TaskPeriod) =>
    updateParams({ period: next === DEFAULT_PERIOD ? undefined : next });

  const setScope = (next: TaskScope) =>
    updateParams({ scope: next === 'all' ? undefined : next });

  const setRange = (nextFrom?: string, nextTo?: string) =>
    updateParams({ from: nextFrom, to: nextTo });

  const applyFilters = (filters: TaskFilters) => {
    updateParams({
      status: filters.status,
      dept: filters.department,
      unit: filters.unit,
      priority: filters.priority,
    });
    setDialog(null);
  };

  return {
    period,
    setPeriod,
    scope,
    setScope,
    isAdmin: isTopLevelRole(role),
    me: user?.displayName ?? '',
    searchInput,
    setSearchInput,
    from,
    to,
    setRange,
    filters: { status, department, unit, priority },
    applyFilters,
    dialog,
    setDialog,
    listQuery,
  };
}
