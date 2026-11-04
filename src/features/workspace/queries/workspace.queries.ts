import { useQuery } from '@tanstack/react-query';
import { workspaceApi } from '../services/workspace.api';

export const workspaceKeys = {
  all: ['workspace'] as const,
  account: () => [...workspaceKeys.all, 'account'] as const,
  drive: (parentId: string | null, query: string) =>
    [...workspaceKeys.all, 'drive', parentId, query] as const,
  breadcrumbs: (folderId: string | null) =>
    [...workspaceKeys.all, 'breadcrumbs', folderId] as const,
  threads: () => [...workspaceKeys.all, 'threads'] as const,
  thread: (threadId: string) =>
    [...workspaceKeys.all, 'thread', threadId] as const,
};

export function useWorkspaceAccount() {
  return useQuery({
    queryKey: workspaceKeys.account(),
    queryFn: ({ signal }) => workspaceApi.getAccount(signal),
    staleTime: 5 * 60_000,
  });
}

export function useDriveItems(parentId: string | null, query = '') {
  return useQuery({
    queryKey: workspaceKeys.drive(parentId, query),
    queryFn: ({ signal }) => workspaceApi.listDriveItems({ parentId, query, signal }),
  });
}

export function useDriveItem(itemId: string | undefined) {
  return useQuery({
    queryKey: [...workspaceKeys.all, 'drive-item', itemId ?? ''],
    queryFn: ({ signal }) => workspaceApi.getDriveItem(itemId ?? '', signal),
    enabled: Boolean(itemId),
  });
}

export function useDriveBreadcrumbs(folderId: string | null) {
  return useQuery({
    queryKey: workspaceKeys.breadcrumbs(folderId),
    queryFn: ({ signal }) => workspaceApi.getDriveBreadcrumbs(folderId, signal),
  });
}

export function useMailThreads() {
  return useQuery({
    queryKey: workspaceKeys.threads(),
    queryFn: ({ signal }) => workspaceApi.listMailThreads(signal),
  });
}

export function useMailThread(threadId: string | undefined) {
  return useQuery({
    queryKey: workspaceKeys.thread(threadId ?? ''),
    queryFn: ({ signal }) => workspaceApi.getMailThread(threadId ?? '', signal),
    enabled: Boolean(threadId),
  });
}
