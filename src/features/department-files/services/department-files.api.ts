import { apiClient } from '../../../shared/api/api-client';
import { env } from '../../../shared/config/env';
import type {
  DepartmentFilesApi,
  DepartmentUnit,
  DepartmentUnitsQuery,
  UnitFileFilterOptions,
  UnitFilesPage,
  UnitFilesQuery,
} from '../types/department-files.types';
import { devDepartmentFilesApi } from './department-files.stub';

/**
 * Assumed backend contract (no API spec exists yet — confirm before release):
 *   GET /department-files/units?parent=<id>&q=<search>      -> DepartmentUnit[]
 *   GET /department-files/units/{id}                       -> DepartmentUnit | 404
 *   GET /department-files/units/{id}/files?q&status&type   -> UnitFilesPage
 *       &from&to&page
 *   GET /department-files/filter-options                   -> UnitFileFilterOptions
 */
function toSearchParams(query: DepartmentUnitsQuery): string {
  const params = new URLSearchParams();
  if (query.parentId) params.set('parent', query.parentId);
  if (query.search) params.set('q', query.search);
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

function filesSearchParams(query: UnitFilesQuery): string {
  const params = new URLSearchParams();
  if (query.search) params.set('q', query.search);
  if (query.status) params.set('status', query.status);
  if (query.documentType) params.set('type', query.documentType);
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  params.set('page', String(query.page));
  return `?${params.toString()}`;
}

const httpDepartmentFilesApi: DepartmentFilesApi = {
  listUnits: (query, options) =>
    apiClient.get<DepartmentUnit[]>(
      `/department-files/units${toSearchParams(query)}`,
      { signal: options?.signal },
    ),
  getUnit: (id, options) =>
    apiClient.get<DepartmentUnit>(`/department-files/units/${id}`, {
      signal: options?.signal,
    }),
  listUnitFiles: (query, options) =>
    apiClient.get<UnitFilesPage>(
      `/department-files/units/${query.unitId}/files${filesSearchParams(query)}`,
      { signal: options?.signal },
    ),
  listUnitFileFilterOptions: (options) =>
    apiClient.get<UnitFileFilterOptions>('/department-files/filter-options', {
      signal: options?.signal,
    }),
};

export const departmentFilesApi: DepartmentFilesApi = env.apiBaseUrl
  ? httpDepartmentFilesApi
  : devDepartmentFilesApi;
