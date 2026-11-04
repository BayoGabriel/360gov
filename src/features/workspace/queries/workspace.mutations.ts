import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceApi } from '../services/workspace.api';
import type {
  CreateFolderInput,
  SendMailInput,
  UploadDriveFileInput,
} from '../types/workspace.types';
import { workspaceKeys } from './workspace.queries';

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFolderInput) => workspaceApi.createFolder(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

export function useUploadDriveFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UploadDriveFileInput) => workspaceApi.uploadFile(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

export function useToggleDriveStar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => workspaceApi.toggleDriveStar(itemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

export function useToggleMailStar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (threadId: string) => workspaceApi.toggleMailStar(threadId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

export function useMarkThreadRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (threadId: string) => workspaceApi.markThreadRead(threadId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.threads() });
    },
  });
}

export function useSendMail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SendMailInput) => workspaceApi.sendMail(input),
    onSuccess: (_message, input) => {
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.threads() });
      if (input.threadId) {
        void queryClient.invalidateQueries({
          queryKey: workspaceKeys.thread(input.threadId),
        });
      }
    },
  });
}
