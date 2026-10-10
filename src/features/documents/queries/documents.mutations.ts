import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../services/documents.api';
import { documentKeys } from './documents.queries';

function useFileMutation(mutationFn: (fileId: string) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (_data, fileId) => {
      void queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      void queryClient.invalidateQueries({
        queryKey: documentKeys.file(fileId),
      });
    },
  });
}

export function useApproveFile() {
  return useFileMutation((fileId) => documentsApi.approveFile(fileId));
}

export function useApproveAllPending() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => documentsApi.approveAllPending(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() }),
  });
}

export function useRequestRevision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fileId,
      staffId,
    }: {
      fileId: string;
      staffId?: string;
    }) => documentsApi.requestRevision(fileId, staffId),
    onSuccess: (_data, { fileId }) => {
      void queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      void queryClient.invalidateQueries({
        queryKey: documentKeys.file(fileId),
      });
    },
  });
}

export function useArchiveFile() {
  return useFileMutation((fileId) => documentsApi.archiveFile(fileId));
}

export function useAddNote(fileId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (note: string) => documentsApi.addNote(fileId, note),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: documentKeys.comments(fileId),
      }),
  });
}

export function useForwardDocument(fileId: string) {
  return useMutation({
    mutationFn: (recipientIds: string[]) =>
      documentsApi.forwardDocument(fileId, recipientIds),
  });
}
