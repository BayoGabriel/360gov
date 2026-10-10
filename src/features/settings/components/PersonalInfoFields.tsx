import { Clock, Mail } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { ProfileFormValues } from '../schemas/settings.schemas';
import type { TimeZoneOption } from '../types/settings.types';
import { BioField } from './BioField';
import { FormRow } from './FormRow';
import { PhotoUploadField } from './PhotoUploadField';
import { SelectInput } from './SelectInput';
import { TextInput } from './TextInput';
import styles from './settings.module.css';

interface PersonalInfoFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
  departments: string[];
  timeZones: TimeZoneOption[];
  photoUrl?: string;
  displayName: string;
  onPhoto: (file: File) => void;
}

export function PersonalInfoFields({
  form,
  departments,
  timeZones,
  photoUrl,
  displayName,
  onPhoto,
}: PersonalInfoFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form;
  const departmentOptions = departments.map((name) => ({
    value: name,
    label: name,
  }));

  return (
    <>
      <FormRow label="Name">
        <div className={styles.nameGrid}>
          <TextInput
            aria-label="First name"
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <TextInput
            aria-label="Last name"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
      </FormRow>
      <FormRow label="Email address">
        <TextInput
          type="email"
          icon={Mail}
          aria-label="Email address"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
      </FormRow>
      <FormRow label="Your photo" hint="This will be displayed on your profile.">
        <PhotoUploadField
          photoUrl={photoUrl}
          name={displayName}
          onSelect={onPhoto}
        />
      </FormRow>
      <FormRow label="Title">
        <TextInput
          aria-label="Title"
          error={errors.title?.message}
          {...register('title')}
        />
      </FormRow>
      <FormRow label="Department">
        <SelectInput
          aria-label="Department"
          options={departmentOptions}
          error={errors.department?.message}
          {...register('department')}
        />
      </FormRow>
      <FormRow label="Time Zone">
        <SelectInput
          icon={Clock}
          aria-label="Time zone"
          options={timeZones}
          error={errors.timeZone?.message}
          {...register('timeZone')}
        />
      </FormRow>
      <FormRow label="Bio" hint="Write a short introduction.">
        <BioField form={form} />
      </FormRow>
    </>
  );
}
