import type {
  AuthApi,
  LoginRequest,
  LoginResponse,
} from '../types/auth.types';
import { roleForDevEmail } from './dev-roles';

const SIMULATED_LATENCY_MS = 600;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

/**
 * Development-only auth stub used when no VITE_API_BASE_URL is configured.
 * It lets the screens be exercised end to end without a backend.
 * Replace by configuring the real API; never ship fabricated auth in production.
 */
export const devAuthApi: AuthApi = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    await delay();
    return {
      user: {
        id: 'dev-user',
        displayName: 'Dev User',
        email: request.identifier,
        role: roleForDevEmail(request.identifier),
      },
    };
  },
  async requestPasswordReset(): Promise<void> {
    await delay();
  },
  async verifyResetCode(): Promise<void> {
    await delay();
  },
  async resetPassword(): Promise<void> {
    await delay();
  },
  async logout(): Promise<void> {
    await delay();
  },
};
