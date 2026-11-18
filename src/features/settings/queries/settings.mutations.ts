import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../services/settings.api';
import type {
  ProfileInput,
  SignatureInput,
  UploadInput,
} from '../types/settings.types';
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

function useInvalidateSignatures() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: settingsKeys.signatures(),
    });
}

export function useCreateSignature() {
  const invalidate = useInvalidateSignatures();
  return useMutation({
    mutationFn: (input: SignatureInput) =>
      settingsApi.createSignature(input),
    onSuccess: invalidate,
  });
}

export function useDeleteSignature() {
  const invalidate = useInvalidateSignatures();
  return useMutation({
    mutationFn: (signatureId: string) =>
      settingsApi.deleteSignature(signatureId),
    onSuccess: invalidate,
  });
}

export function useSetDefaultSignature() {
  const invalidate = useInvalidateSignatures();
  return useMutation({
    mutationFn: (signatureId: string) =>
      settingsApi.setDefaultSignature(signatureId),
    onSuccess: invalidate,
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
