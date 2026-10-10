import { apiClient } from '../../../shared/api/api-client';
import { env } from '../../../shared/config/env';
import type { AppRole } from '../../../shared/auth/roles';
import type {
  DashboardApi,
  DashboardData,
  OutgoingFileItem,
  StaffFilesQuery,
  StaffFilesResult,
} from '../types/dashboard.types';
import { devDashboardApi } from './dashboard.stub';

/**
 * Assumed backend contract (no API spec exists yet — confirm before release):
 *   GET  /dashboard?role={role}                          -> role-shaped payload
 *   GET  /dashboard/staff/files?period&search&status&from&to -> StaffFilesResult
 *   POST /dashboard/staff/files/{id}/actions {action, fileName?} -> OutgoingFileItem
 *   POST /documents/scan {fileName}                      -> 204
 */
const httpDashboardApi: DashboardApi = {
  getDashboard: (role: AppRole, options) =>
    apiClient.get<DashboardData>(`/dashboard?role=${role}`, {
      signal: options?.signal,
    }),
  getStaffFiles: (query, options) =>
    apiClient.get<StaffFilesResult>(
      `/dashboard/staff/files?${toStaffFilesParams(query)}`,
      { signal: options?.signal },
    ),
  updateOutgoingFile: (fileId, action, fileName) =>
    apiClient.post<OutgoingFileItem>(
      `/dashboard/staff/files/${fileId}/actions`,
      { action, fileName },
    ),
  scanDocument: (fileName) =>
    apiClient.post('/documents/scan', { fileName }),
};

function toStaffFilesParams(query: StaffFilesQuery): string {
  const params = new URLSearchParams();
  if (query.period) params.set('period', query.period);
  if (query.search) params.set('search', query.search);
  if (query.status) params.set('status', query.status);
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  return params.toString();
}

export const dashboardApi: DashboardApi = env.apiBaseUrl
  ? httpDashboardApi
  : devDashboardApi;
