import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { useMemoList } from '../queries/memos.queries';
import type {
  MemoSort,
  MemoStatus,
  MemoSummary,
} from '../types/memos.types';

const STATUSES: MemoStatus[] = ['processing', 'success', 'declined'];

export interface MemoFilters {
  status?: MemoStatus;
}

function parseStatus(raw: string | null): MemoStatus | undefined {
  return STATUSES.includes(raw as MemoStatus)
    ? (raw as MemoStatus)
    : undefined;
}

function parseSort(raw: string | null): MemoSort {
  return raw === 'date-asc' ? 'date-asc' : 'date-desc';
}

type ParamPatch = Record<string, string | undefined>;

export function useMemosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');
  const debouncedSearch = useDebouncedValue(searchInput);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const updateParams = useCallback(
    (patch: ParamPatch) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(patch)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        return next;
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
    updateParams({ q: debouncedSearch || undefined, page: undefined });
  }, [debouncedSearch, updateParams]);

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const sort = parseSort(searchParams.get('sort'));
  const filters: MemoFilters = {
    status: parseStatus(searchParams.get('status')),
  };
  const selectedMemoId = searchParams.get('memo');
  const from = searchParams.get('from') ?? undefined;
  const to = searchParams.get('to') ?? undefined;

  const list = useMemoList({
    page,
    sort,
    query: searchParams.get('q') ?? '',
    status: filters.status,
    from,
    to,
  });

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = (rows: MemoSummary[]) => {
    setSelected((prev) =>
      prev.size === rows.length ? new Set() : new Set(rows.map((r) => r.id)),
    );
  };

  return {
    searchInput,
    setSearchInput,
    list,
    filters,
    selected,
    filtersOpen,
    createTaskOpen,
    selectedMemoId,
    from,
    to,
    sort,
    setPage: (nextPage: number) =>
      updateParams({ page: nextPage > 1 ? String(nextPage) : undefined }),
    setDateRange: (f: string | undefined, t: string | undefined) =>
      updateParams({ from: f, to: t, page: undefined }),
    toggleSort: () =>
      updateParams({
        sort: sort === 'date-desc' ? 'date-asc' : undefined,
        page: undefined,
      }),
    applyFilters: (next: MemoFilters) =>
      updateParams({ status: next.status, page: undefined }),
    toggleRow,
    toggleAll,
    openMemo: (id: string) => updateParams({ memo: id }),
    closeMemo: () => updateParams({ memo: undefined }),
    openFilters: () => setFiltersOpen(true),
    closeFilters: () => setFiltersOpen(false),
    openCreateTask: () => setCreateTaskOpen(true),
    closeCreateTask: () => setCreateTaskOpen(false),
  };
}
