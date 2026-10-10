import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../services/settings.api';

export const settingsKeys = {
  all: ['settings'] as const,
  profile: () => [...settingsKeys.all, 'profile'] as const,
  options: () => [...settingsKeys.all, 'options'] as const,
  uploads: () => [...settingsKeys.all, 'uploads'] as const,
};

const POLL_INTERVAL_MS = 1_500;

export function useProfileSettings() {
  return useQuery({
    queryKey: settingsKeys.profile(),
    queryFn: ({ signal }) => settingsApi.getProfile(signal),
    staleTime: 60_000,
  });
}

export function useSettingsOptions(enabled: boolean) {
  return useQuery({
    queryKey: settingsKeys.options(),
    queryFn: ({ signal }) => settingsApi.getOptions(signal),
    staleTime: 5 * 60_000,
    enabled,
  });
}

export function useWorkflowUploads() {
  return useQuery({
    queryKey: settingsKeys.uploads(),
    queryFn: ({ signal }) => settingsApi.listUploads(signal),
    // Poll while any upload is still in flight.
    refetchInterval: (query) =>
      query.state.data?.some((upload) => upload.progress < 100)
        ? POLL_INTERVAL_MS
        : false,
  });
}
