import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { AppRole } from '../../../shared/auth/roles';
import { dashboardApi } from '../services/dashboard.api';
import type { StaffFilesQuery } from '../types/dashboard.types';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  byRole: (role: AppRole) => [...dashboardKeys.all, role] as const,
  staffFiles: (query: StaffFilesQuery) =>
    [...dashboardKeys.all, 'staff-files', query] as const,
};

export function useDashboardData(role: AppRole) {
  return useQuery({
    queryKey: dashboardKeys.byRole(role),
    queryFn: ({ signal }) => dashboardApi.getDashboard(role, { signal }),
  });
}

export function useStaffFiles(query: StaffFilesQuery) {
  return useQuery({
    queryKey: dashboardKeys.staffFiles(query),
    queryFn: ({ signal }) => dashboardApi.getStaffFiles(query, { signal }),
    placeholderData: keepPreviousData,
  });
}
