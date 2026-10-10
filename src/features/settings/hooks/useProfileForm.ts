import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useUpdateProfile, useUploadPhoto } from '../queries/settings.mutations';
import { profileFormSchema } from '../schemas/settings.schemas';
import type { ProfileFormValues } from '../schemas/settings.schemas';
import type { ProfileSettings } from '../types/settings.types';
import { usePhotoPreview } from './usePhotoPreview';

export function useProfileForm(profile: ProfileSettings) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    // Re-initialises the form when a fresh profile arrives from the query.
    values: profile,
  });
  const photo = usePhotoPreview(profile.photoUrl);
  const updateProfile = useUpdateProfile();
  const uploadPhoto = useUploadPhoto();

  const save = (values: ProfileFormValues, photoUrl?: string) => {
    updateProfile.mutate(
      { ...values, photoUrl: photoUrl ?? profile.photoUrl },
      { onSuccess: photo.clear },
    );
  };

  const submit = form.handleSubmit((values) => {
    if (photo.file) {
      uploadPhoto.mutate(photo.file, {
        onSuccess: ({ photoUrl }) => save(values, photoUrl),
      });
    } else {
      save(values);
    }
  });

  const cancel = () => {
    form.reset();
    photo.clear();
  };

  return {
    form,
    photo,
    submit,
    cancel,
    isPending: updateProfile.isPending || uploadPhoto.isPending,
    isError: updateProfile.isError || uploadPhoto.isError,
    isSaved: updateProfile.isSuccess,
    isDirty: form.formState.isDirty || photo.file !== null,
  };
}
