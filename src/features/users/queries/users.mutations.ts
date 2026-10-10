import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../services/users.api';
import type {
  CreateUserInput,
  DeactivateUserInput,
  UserRole,
} from '../types/users.types';
import { userKeys } from './users.queries';

function useInvalidateUsers() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: userKeys.lists() });
}

export function useCreateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (input: CreateUserInput) => usersApi.create(input),
    onSuccess: invalidate,
  });
}

export function useAssignRole() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      usersApi.assignRole(userId, role),
    onSuccess: invalidate,
  });
}

export function useDeactivateUser(userId: string) {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (input: DeactivateUserInput) =>
      usersApi.deactivate(userId, input),
    onSuccess: invalidate,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (userId: string) => usersApi.resetPassword(userId),
  });
}

export function useForwardUser() {
  return useMutation({
    mutationFn: (userId: string) => usersApi.forwardUser(userId),
  });
}

export function useApproveUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (userId: string) => usersApi.approveUser(userId),
    onSuccess: invalidate,
  });
}
