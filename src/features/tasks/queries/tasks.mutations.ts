import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../services/tasks.api';
import type { TaskInput, TaskStatus } from '../types/tasks.types';
import { taskKeys } from './tasks.queries';

function useInvalidateTasks() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
}

export function useCreateTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (input: TaskInput) => tasksApi.create(input),
    onSuccess: invalidate,
  });
}

export function useUpdateTask(taskId: string) {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (input: TaskInput) => tasksApi.update(taskId, input),
    onSuccess: invalidate,
  });
}

export function useDeleteTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (taskId: string) => tasksApi.remove(taskId),
    onSuccess: invalidate,
  });
}

export function useCaptureTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (taskId: string) => tasksApi.capture(taskId),
    onSuccess: invalidate,
  });
}

export function useUpdateTaskStatus() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      tasksApi.updateStatus(taskId, status),
    onSuccess: invalidate,
  });
}
