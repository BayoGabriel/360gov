import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../services/settings.api';
import type { ProfileInput, UploadInput } from '../types/settings.types';
import { settingsKeys } from './settings.queries';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProfileInput) => settingsApi.updateProfile(input),
    onSuccess: (profile) => {
      queryClient.setQueryData(settingsKeys.profile(), profile);
    },
  });
}

export function useUploadPhoto() {
  return useMutation({
    mutationFn: (file: File) => settingsApi.uploadPhoto(file),
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UploadInput) => settingsApi.uploadFile(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: settingsKeys.uploads() }),
  });
}

export function useDeleteUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uploadId: string) => settingsApi.removeUpload(uploadId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: settingsKeys.uploads() }),
  });
}
