import { useQuery } from '@tanstack/react-query';
import type { AppRole } from '../../../shared/auth/roles';
import { dashboardApi } from '../services/dashboard.api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  byRole: (role: AppRole) => [...dashboardKeys.all, role] as const,
};

export function useDashboardData(role: AppRole) {
  return useQuery({
    queryKey: dashboardKeys.byRole(role),
    queryFn: ({ signal }) => dashboardApi.getDashboard(role, { signal }),
  });
}
