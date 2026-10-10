import { useDeferredValue, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useContractList } from '../queries/procurement.queries';
import type {
  ContractCategory,
  ContractStatus,
  ContractView,
  ProcurementMethod,
} from '../types/procurement.types';

export const CONTRACT_VIEWS: { id: ContractView; label: string }[] = [
  { id: 'all', label: 'All Contracts' },
  { id: 'draft', label: 'Drafts' },
  { id: 'open', label: 'Open' },
  { id: 'evaluation', label: 'In Evaluation' },
  { id: 'awarded', label: 'Awarded' },
  { id: 'completed', label: 'Completed' },
];

const VIEW_IDS = CONTRACT_VIEWS.map((v) => v.id);
const CATEGORIES: ContractCategory[] = [
  'goods',
  'works',
  'services',
  'consultancy',
];
const METHODS: ProcurementMethod[] = [
  'open-tender',
  'selective-tender',
  'direct-procurement',
  'request-for-quotation',
];
const STATUSES: ContractStatus[] = [
  'draft',
  'open',
  'evaluation',
  'awarded',
  'completed',
  'cancelled',
];

export interface ContractFilters {
  status?: ContractStatus;
  category?: ContractCategory;
  method?: ProcurementMethod;
  department?: string;
}

function parseView(raw: string | null): ContractView {
  return VIEW_IDS.includes(raw as ContractView) ? (raw as ContractView) : 'all';
}

function parseEnum<T extends string>(raw: string | null, allowed: T[]) {
  return allowed.includes(raw as T) ? (raw as T) : undefined;
}

type ParamPatch = Record<string, string | undefined>;

export function useProcurementPage() {
  const [params, setParams] = useSearchParams();
  const view = parseView(params.get('view'));
  const page = Math.max(1, Number(params.get('page')) || 1);
  const query = params.get('q') ?? '';
  const from = params.get('from') ?? undefined;
  const to = params.get('to') ?? undefined;
  const filters: ContractFilters = {
    status: view === 'all' ? parseEnum(params.get('status'), STATUSES) : undefined,
    category: parseEnum(params.get('category'), CATEGORIES),
    method: parseEnum(params.get('method'), METHODS),
    department: params.get('dept') ?? undefined,
  };
  const deferredQuery = useDeferredValue(query);

  const result = useContractList({
    view,
    page,
    query: deferredQuery,
    from,
    to,
    ...filters,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const updateParams = (patch: ParamPatch) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setParams(next);
  };

  const setView = (nextView: ContractView) => {
    updateParams({ view: nextView, page: undefined, status: undefined });
  };
  const setPage = (nextPage: number) =>
    updateParams({ page: nextPage > 1 ? String(nextPage) : undefined });
  const setQuery = (q: string) =>
    updateParams({ q: q || undefined, page: undefined });
  const setRange = (f: string | undefined, t: string | undefined) =>
    updateParams({ from: f, to: t, page: undefined });
  const setFilters = (next: ContractFilters) =>
    updateParams({
      status: next.status,
      category: next.category,
      method: next.method,
      dept: next.department,
      page: undefined,
    });

  return {
    view,
    page,
    query,
    from,
    to,
    filters,
    filtersOpen,
    createOpen,
    ...result,
    setView,
    setPage,
    setQuery,
    setRange,
    setFilters,
    openFilters: () => setFiltersOpen(true),
    closeFilters: () => setFiltersOpen(false),
    openCreate: () => setCreateOpen(true),
    closeCreate: () => setCreateOpen(false),
  };
}
