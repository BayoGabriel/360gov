import { useQuery } from '@tanstack/react-query';
import { reportingApi } from '../services/reporting.api';

export const reportKeys = {
  all: ['reports'] as const,
  overview: () => [...reportKeys.all, 'overview'] as const,
  departments: () => [...reportKeys.all, 'departments'] as const,
  turnaround: (departmentId: string) =>
    [...reportKeys.all, 'turnaround', departmentId] as const,
};

export function useReportingOverview() {
  return useQuery({
    queryKey: reportKeys.overview(),
    queryFn: ({ signal }) => reportingApi.getOverview(signal),
  });
}

export function useReportDepartments() {
  return useQuery({
    queryKey: reportKeys.departments(),
    queryFn: ({ signal }) => reportingApi.listDepartments(signal),
    staleTime: 5 * 60_000,
  });
}

export function useTurnaroundReport(departmentId: string) {
  return useQuery({
    queryKey: reportKeys.turnaround(departmentId),
    queryFn: ({ signal }) =>
      reportingApi.getTurnaround(departmentId, signal),
    enabled: departmentId !== '',
  });
}
