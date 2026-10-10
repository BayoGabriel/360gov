import { apiClient } from '../../../shared/api/api-client';
import { env } from '../../../shared/config/env';
import type {
  MonthlyReport,
  ReportDepartment,
  ReportingApi,
  ReportingOverview,
} from '../types/reporting.types';
import { devReportingApi } from './reporting.stub';

/**
 * Assumed backend contract (no API spec exists yet — confirm before release):
 *   GET /reports/overview                  -> ReportingOverview
 *   GET /reports/departments               -> ReportDepartment[]
 *   GET /reports/turnaround?department={id} -> MonthlyReport
 */
const httpReportingApi: ReportingApi = {
  getOverview: (signal) =>
    apiClient.get<ReportingOverview>('/reports/overview', { signal }),
  listDepartments: (signal) =>
    apiClient.get<ReportDepartment[]>('/reports/departments', { signal }),
  getTurnaround: (departmentId, signal) =>
    apiClient.get<MonthlyReport>(
      `/reports/turnaround?department=${encodeURIComponent(departmentId)}`,
      { signal },
    ),
};

export const reportingApi: ReportingApi = env.apiBaseUrl
  ? httpReportingApi
  : devReportingApi;
