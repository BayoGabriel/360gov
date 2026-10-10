import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { documentsApi } from '../services/documents.api';
import type { DocumentListQuery } from '../types/documents.types';

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (query: Omit<DocumentListQuery, 'signal'>) =>
    [...documentKeys.lists(), query] as const,
  filterOptions: () => [...documentKeys.all, 'filter-options'] as const,
  recipients: () => [...documentKeys.all, 'forward-recipients'] as const,
  trail: (fileId: string) => [...documentKeys.all, 'trail', fileId] as const,
  file: (fileId: string) => [...documentKeys.all, 'file', fileId] as const,
  comments: (fileId: string) =>
    [...documentKeys.all, 'comments', fileId] as const,
};

export function useDocumentList(query: Omit<DocumentListQuery, 'signal'>) {
  return useQuery({
    queryKey: documentKeys.list(query),
    queryFn: ({ signal }) => documentsApi.list({ ...query, signal }),
    placeholderData: keepPreviousData,
  });
}

export function useDocumentFilterOptions() {
  return useQuery({
    queryKey: documentKeys.filterOptions(),
    queryFn: ({ signal }) => documentsApi.listFilterOptions(signal),
    staleTime: 5 * 60_000,
  });
}

export function useForwardRecipients(enabled: boolean) {
  return useQuery({
    queryKey: documentKeys.recipients(),
    queryFn: ({ signal }) => documentsApi.listForwardRecipients(signal),
    staleTime: 5 * 60_000,
    enabled,
  });
}

export function useApprovalTrail(fileId: string | null) {
  return useQuery({
    queryKey: documentKeys.trail(fileId ?? ''),
    queryFn: ({ signal }) =>
      documentsApi.getApprovalTrail(fileId ?? '', signal),
    enabled: fileId !== null,
  });
}

export function useFile(fileId: string | undefined) {
  return useQuery({
    queryKey: documentKeys.file(fileId ?? ''),
    queryFn: ({ signal }) => documentsApi.getFile(fileId ?? '', signal),
    enabled: Boolean(fileId),
  });
}

export function useFileComments(fileId: string | undefined) {
  return useQuery({
    queryKey: documentKeys.comments(fileId ?? ''),
    queryFn: ({ signal }) => documentsApi.listComments(fileId ?? '', signal),
    enabled: Boolean(fileId),
  });
}
