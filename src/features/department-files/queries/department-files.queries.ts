import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { departmentFilesApi } from '../services/department-files.api';
import type {
  DepartmentUnitsQuery,
  UnitFilesQuery,
} from '../types/department-files.types';

export const departmentFileKeys = {
  all: ['department-files'] as const,
  units: () => [...departmentFileKeys.all, 'units'] as const,
  unitList: (query: DepartmentUnitsQuery) =>
    [...departmentFileKeys.units(), 'list', query] as const,
  unit: (id: string) => [...departmentFileKeys.units(), 'detail', id] as const,
  unitFiles: (query: UnitFilesQuery) =>
    [...departmentFileKeys.unit(query.unitId), 'files', query] as const,
  filterOptions: () => [...departmentFileKeys.all, 'filter-options'] as const,
};

export function useDepartmentUnits(query: DepartmentUnitsQuery) {
  return useQuery({
    queryKey: departmentFileKeys.unitList(query),
    queryFn: ({ signal }) => departmentFilesApi.listUnits(query, { signal }),
    placeholderData: keepPreviousData,
  });
}

export function useDepartmentUnit(id: string | null) {
  return useQuery({
    queryKey: departmentFileKeys.unit(id ?? ''),
    queryFn: ({ signal }) => departmentFilesApi.getUnit(id ?? '', { signal }),
    enabled: id !== null,
  });
}

export function useUnitFiles(query: UnitFilesQuery) {
  return useQuery({
    queryKey: departmentFileKeys.unitFiles(query),
    queryFn: ({ signal }) => departmentFilesApi.listUnitFiles(query, { signal }),
    placeholderData: keepPreviousData,
  });
}

export function useUnitFileFilterOptions() {
  return useQuery({
    queryKey: departmentFileKeys.filterOptions(),
    queryFn: ({ signal }) =>
      departmentFilesApi.listUnitFileFilterOptions({ signal }),
    staleTime: 5 * 60_000,
  });
}
