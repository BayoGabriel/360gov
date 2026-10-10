import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '../services/dashboard.api';
import type { OutgoingFileAction } from '../types/dashboard.types';
import { dashboardKeys } from './dashboard.queries';

interface OutgoingFileActionInput {
  fileId: string;
  action: OutgoingFileAction;
  fileName?: string;
}

export function useOutgoingFileAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, action, fileName }: OutgoingFileActionInput) =>
      dashboardApi.updateOutgoingFile(fileId, action, fileName),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
  });
}

export function useScanDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileName: string) => dashboardApi.scanDocument(fileName),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
  });
}
