import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { tasksApi } from '../services/tasks.api';
import type { TaskListQuery } from '../types/tasks.types';

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (query: Omit<TaskListQuery, 'signal'>) =>
    [...taskKeys.lists(), query] as const,
  formOptions: () => [...taskKeys.all, 'form-options'] as const,
};

export function useTaskList(query: Omit<TaskListQuery, 'signal'>) {
  return useQuery({
    queryKey: taskKeys.list(query),
    queryFn: ({ signal }) => tasksApi.list({ ...query, signal }),
    placeholderData: keepPreviousData,
  });
}

export function useTaskFormOptions(enabled: boolean) {
  return useQuery({
    queryKey: taskKeys.formOptions(),
    queryFn: ({ signal }) => tasksApi.listFormOptions(signal),
    staleTime: 5 * 60_000,
    enabled,
  });
}
