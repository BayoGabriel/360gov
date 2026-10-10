import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { memosApi } from '../services/memos.api';
import type { MemoListQuery } from '../types/memos.types';

export const memoKeys = {
  all: ['memos'] as const,
  lists: () => [...memoKeys.all, 'list'] as const,
  list: (query: Omit<MemoListQuery, 'signal'>) =>
    [...memoKeys.lists(), query] as const,
  detail: (memoId: string) => [...memoKeys.all, 'detail', memoId] as const,
  messages: (memoId: string) =>
    [...memoKeys.all, 'messages', memoId] as const,
};

export function useMemoList(query: Omit<MemoListQuery, 'signal'>) {
  return useQuery({
    queryKey: memoKeys.list(query),
    queryFn: ({ signal }) => memosApi.list({ ...query, signal }),
    placeholderData: keepPreviousData,
  });
}

export function useMemoDetail(memoId: string | null) {
  return useQuery({
    queryKey: memoKeys.detail(memoId ?? ''),
    queryFn: ({ signal }) => memosApi.getMemo(memoId ?? '', signal),
    enabled: memoId !== null,
  });
}

export function useMemoMessages(memoId: string | null) {
  return useQuery({
    queryKey: memoKeys.messages(memoId ?? ''),
    queryFn: ({ signal }) => memosApi.listMessages(memoId ?? '', signal),
    enabled: memoId !== null,
  });
}
