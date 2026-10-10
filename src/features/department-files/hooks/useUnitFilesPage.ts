import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { useUnitFiles } from '../queries/department-files.queries';
import type {
  UnitFileRecord,
  UnitFileStatus,
} from '../types/department-files.types';

const STATUSES: UnitFileStatus[] = ['processing', 'success', 'declined'];

export interface UnitFileFilters {
  status?: UnitFileStatus;
  documentType?: string;
}

function readStatus(raw: string | null): UnitFileStatus | undefined {
  return STATUSES.includes(raw as UnitFileStatus)
    ? (raw as UnitFileStatus)
    : undefined;
}

export function useUnitFilesPage(unitId: string) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewing, setViewing] = useState<UnitFileRecord | null>(null);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const debouncedSearch = useDebouncedValue(searchInput);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('page');
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

  const filesQuery = useUnitFiles({
    unitId,
    search: searchParams.get('q') ?? '',
    status: readStatus(searchParams.get('status')),
    documentType: searchParams.get('dtype') ?? undefined,
    from: searchParams.get('from') ?? undefined,
    to: searchParams.get('to') ?? undefined,
    page: Math.max(1, Number(searchParams.get('page')) || 1),
  });

  const applyFilters = (filters: UnitFileFilters) => {
    updateParams({ status: filters.status, dtype: filters.documentType });
    setFiltersOpen(false);
  };

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = (ids: string[]) => {
    setSelected((prev) =>
      ids.every((id) => prev.has(id)) ? new Set() : new Set(ids),
    );
  };

  return {
    searchInput,
    setSearchInput,
    filesQuery,
    selected,
    toggleSelected,
    toggleAll,
    filters: {
      status: readStatus(searchParams.get('status')),
      documentType: searchParams.get('dtype') ?? undefined,
    },
    applyFilters,
    filtersOpen,
    openFilters: () => setFiltersOpen(true),
    closeFilters: () => setFiltersOpen(false),
    dateFrom: searchParams.get('from') ?? undefined,
    dateTo: searchParams.get('to') ?? undefined,
    setDateRange: (from?: string, to?: string) => updateParams({ from, to }),
    setPage: (page: number) =>
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', String(page));
        return next;
      }),
    viewing,
    setViewing,
  };
}
