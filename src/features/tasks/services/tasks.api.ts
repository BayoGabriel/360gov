import { apiClient } from '../../../shared/api/api-client';
import { env } from '../../../shared/config/env';
import type {
  TaskFormOptions,
  TaskListQuery,
  TaskRecord,
  TasksApi,
} from '../types/tasks.types';
import { devTasksApi } from './tasks.stub';

/**
 * Assumed backend contract (no API spec exists yet — confirm before release):
 *   GET    /tasks?period&query&status&department&priority&scope&from&to -> TaskRecord[]
 *   GET    /tasks/form-options -> { departments, assignees }
 *   POST   /tasks -> TaskRecord
 *   PUT    /tasks/:id -> TaskRecord
 *   DELETE /tasks/:id
 *   POST   /tasks/:id/capture
 *   POST   /tasks/:id/status  { status }
 */
function toSearchParams(query: TaskListQuery): string {
  const params = new URLSearchParams({ period: query.period });
  if (query.query) params.set('query', query.query);
  if (query.status) params.set('status', query.status);
  if (query.department) params.set('department', query.department);
  if (query.priority) params.set('priority', query.priority);
  if (query.scope && query.scope !== 'all') params.set('scope', query.scope);
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  return params.toString();
}

const httpTasksApi: TasksApi = {
  list: (query) =>
    apiClient.get<TaskRecord[]>(`/tasks?${toSearchParams(query)}`, {
      signal: query.signal,
    }),
  listFormOptions: (signal) =>
    apiClient.get<TaskFormOptions>('/tasks/form-options', { signal }),
  create: (input) => apiClient.post<TaskRecord>('/tasks', input),
  update: (taskId, input) => apiClient.put<TaskRecord>(`/tasks/${taskId}`, input),
  remove: (taskId) => apiClient.delete<void>(`/tasks/${taskId}`),
  capture: (taskId) =>
    apiClient.post<void>(`/tasks/${taskId}/capture`, undefined),
  updateStatus: (taskId, status) =>
    apiClient.post<void>(`/tasks/${taskId}/status`, { status }),
};

export const tasksApi: TasksApi = env.apiBaseUrl ? httpTasksApi : devTasksApi;
