import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { useDepartmentUnits } from '../queries/department-files.queries';
import type {
  UnitAccess,
  UnitFileStatus,
} from '../types/department-files.types';

const STATUSES: UnitFileStatus[] = ['processing', 'success', 'declined'];

/** Filters carried in the URL and applied to the unit files view. */
export interface FolderListFilters {
  status?: UnitFileStatus;
  documentType?: string;
}

function readFilters(params: URLSearchParams): FolderListFilters {
  const status = params.get('status');
  return {
    status: STATUSES.includes(status as UnitFileStatus)
      ? (status as UnitFileStatus)
      : undefined,
    documentType: params.get('dtype') ?? undefined,
  };
}

export function useDepartmentFilesPage(
  parentId: string | null,
  access?: UnitAccess,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');
  const [filtersOpen, setFiltersOpen] = useState(false);
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

  const unitsQuery = useDepartmentUnits({
    parentId,
    search: searchParams.get('q') ?? '',
    access,
  });

  const applyFilters = (filters: FolderListFilters) => {
    updateParams({ status: filters.status, dtype: filters.documentType });
    setFiltersOpen(false);
  };

  return {
    searchInput,
    setSearchInput,
    unitsQuery,
    filters: readFilters(searchParams),
    applyFilters,
    filtersOpen,
    openFilters: () => setFiltersOpen(true),
    closeFilters: () => setFiltersOpen(false),
    dateFrom: searchParams.get('from') ?? undefined,
    dateTo: searchParams.get('to') ?? undefined,
    setDateRange: (from?: string, to?: string) => updateParams({ from, to }),
  };
}
