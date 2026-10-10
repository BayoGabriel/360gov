import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usersApi } from '../services/users.api';
import type { UserListQuery } from '../types/users.types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (query: Omit<UserListQuery, 'signal'>) =>
    [...userKeys.lists(), query] as const,
  formOptions: () => [...userKeys.all, 'form-options'] as const,
};

export function useUserList(query: Omit<UserListQuery, 'signal'>) {
  return useQuery({
    queryKey: userKeys.list(query),
    queryFn: ({ signal }) => usersApi.list({ ...query, signal }),
    placeholderData: keepPreviousData,
  });
}

export function useUserFormOptions(enabled: boolean) {
  return useQuery({
    queryKey: userKeys.formOptions(),
    queryFn: ({ signal }) => usersApi.listFormOptions(signal),
    staleTime: 5 * 60_000,
    enabled,
  });
}
