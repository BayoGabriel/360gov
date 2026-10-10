import { apiClient } from '../../../shared/api/api-client';
import { env } from '../../../shared/config/env';
import type { AppRole } from '../../../shared/auth/roles';
import type { DashboardApi, DashboardData } from '../types/dashboard.types';
import { devDashboardApi } from './dashboard.stub';

/**
 * Assumed backend contract (no API spec exists yet — confirm before release):
 *   GET /dashboard?role={role} -> role-shaped dashboard payload
 */
const httpDashboardApi: DashboardApi = {
  getDashboard: (role: AppRole, options) =>
    apiClient.get<DashboardData>(`/dashboard?role=${role}`, {
      signal: options?.signal,
    }),
};

export const dashboardApi: DashboardApi = env.apiBaseUrl
  ? httpDashboardApi
  : devDashboardApi;
