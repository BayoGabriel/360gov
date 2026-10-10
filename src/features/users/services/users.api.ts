import { apiClient } from '../../../shared/api/api-client';
import { env } from '../../../shared/config/env';
import type {
  UserFormOptions,
  UserListQuery,
  UserListResult,
  UsersApi,
} from '../types/users.types';
import { devUsersApi } from './users.stub';

/**
 * Assumed backend contract (no API spec exists yet — confirm before release):
 *   GET  /users?page&query&status&role&department&from&to&sort -> UserListResult
 *   GET  /users/form-options            -> UserFormOptions
 *   POST /users                         -> UserRecord
 *   PUT  /users/{id}/role               { role }             -> 204
 *   POST /users/{id}/deactivate         { reasonTitle, description } -> 204
 *   POST /users/{id}/reset-password                          -> 204
 *   POST /users/{id}/forward                                 -> 204
 *   POST /users/{id}/approve                                 -> 204
 */
function toSearchParams(query: UserListQuery): string {
  const params = new URLSearchParams({ page: String(query.page) });
  if (query.query) params.set('query', query.query);
  if (query.status) params.set('status', query.status);
  if (query.role) params.set('role', query.role);
  if (query.department) params.set('department', query.department);
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  if (query.sort) params.set('sort', query.sort);
  return params.toString();
}

const httpUsersApi: UsersApi = {
  list: (query) =>
    apiClient.get<UserListResult>(`/users?${toSearchParams(query)}`, {
      signal: query.signal,
    }),
  listFormOptions: (signal) =>
    apiClient.get<UserFormOptions>('/users/form-options', { signal }),
  create: (input) => apiClient.post('/users', input),
  assignRole: (userId, role) =>
    apiClient.put(`/users/${userId}/role`, { role }),
  deactivate: (userId, input) =>
    apiClient.post(`/users/${userId}/deactivate`, input),
  resetPassword: (userId) =>
    apiClient.post(`/users/${userId}/reset-password`, undefined),
  forwardUser: (userId) =>
    apiClient.post(`/users/${userId}/forward`, undefined),
  approveUser: (userId) =>
    apiClient.post(`/users/${userId}/approve`, undefined),
};

export const usersApi: UsersApi = env.apiBaseUrl ? httpUsersApi : devUsersApi;
