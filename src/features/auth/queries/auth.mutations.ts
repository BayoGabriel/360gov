import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/auth.api';
import type {
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  VerifyCodeRequest,
} from '../types/auth.types';

export function useLoginMutation() {
  return useMutation({
    mutationFn: (request: LoginRequest) => authApi.login(request),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (request: ForgotPasswordRequest) =>
      authApi.requestPasswordReset(request),
  });
}

export function useVerifyCodeMutation() {
  return useMutation({
    mutationFn: (request: VerifyCodeRequest) => authApi.verifyResetCode(request),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (request: ResetPasswordRequest) =>
      authApi.resetPassword(request),
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: () => authApi.logout(),
  });
}
