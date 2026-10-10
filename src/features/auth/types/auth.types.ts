import type { AppRole } from '../../../shared/auth/roles';

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  /**
   * Backend-owned once the API returns it. Currently populated by the
   * dev email map in services/dev-roles.ts.
   */
  role?: AppRole;
}

export interface LoginRequest {
  /** Email address or government ID, per the sign-in form. */
  identifier: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  user: AuthUser;
}

export interface ForgotPasswordRequest {
  identifier: string;
}

export interface VerifyCodeRequest {
  identifier: string;
  code: string;
}

export interface ResetPasswordRequest {
  identifier: string;
  code: string;
  newPassword: string;
}

export interface AuthApi {
  login(request: LoginRequest): Promise<LoginResponse>;
  requestPasswordReset(request: ForgotPasswordRequest): Promise<void>;
  verifyResetCode(request: VerifyCodeRequest): Promise<void>;
  resetPassword(request: ResetPasswordRequest): Promise<void>;
  logout(): Promise<void>;
}
