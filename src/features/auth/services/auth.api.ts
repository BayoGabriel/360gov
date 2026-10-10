import { apiClient } from '../../../shared/api/api-client';
import { env } from '../../../shared/config/env';
import type { AuthApi } from '../types/auth.types';
import { devAuthApi } from './auth.stub';

/**
 * Assumed backend contract (no API spec exists yet — confirm before release):
 *   POST /auth/login            { identifier, password, rememberMe } -> { user }
 *   POST /auth/password/forgot  { identifier }                        -> 204
 *   POST /auth/password/verify  { identifier, code }                  -> 204
 *   POST /auth/password/reset   { identifier, code, newPassword }     -> 204
 *   POST /auth/logout                                                 -> 204
 * Session is expected via an httpOnly cookie (credentials: 'include').
 */
const httpAuthApi: AuthApi = {
  login: (request) => apiClient.post('/auth/login', request),
  requestPasswordReset: (request) =>
    apiClient.post('/auth/password/forgot', request),
  verifyResetCode: (request) =>
    apiClient.post('/auth/password/verify', request),
  resetPassword: (request) =>
    apiClient.post('/auth/password/reset', request),
  logout: () => apiClient.post('/auth/logout', undefined),
};

export const authApi: AuthApi = env.apiBaseUrl ? httpAuthApi : devAuthApi;
