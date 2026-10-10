import { Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { InputField, SelectField } from '../../../shared/components/FormField';
import type { AddUserFormValues } from '../schemas/users.schemas';
import { ACCESS_LEVELS, USER_ROLES } from '../types/users.types';
import type { UserFormOptions } from '../types/users.types';
import styles from './users.module.css';

interface UserFormFieldsProps {
  form: UseFormReturn<AddUserFormValues>;
  options?: UserFormOptions;
  optionsPending: boolean;
}

export function UserFormFields({
  form,
  options,
  optionsPending,
}: UserFormFieldsProps) {
  const { register, control, formState } = form;
  const errors = formState.errors;
  const toOptions = (values: readonly string[]) =>
    values.map((value) => ({ value, label: value }));

  return (
    <div className={styles.formGrid}>
      <InputField
        label="Full Name"
        placeholder="Full Name"
        registration={register('fullName')}
        error={errors.fullName?.message}
      />
      <InputField
        label="Email"
        placeholder="Email"
        registration={register('email')}
        error={errors.email?.message}
      />
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Role"
            placeholder="Role"
            value={field.value ?? ''}
            onChange={field.onChange}
            options={USER_ROLES.map(({ value, label }) => ({ value, label }))}
            error={errors.role?.message}
          />
        )}
      />
      <Controller
        name="department"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Department"
            placeholder="Department"
            value={field.value}
            onChange={field.onChange}
            options={toOptions(options?.departments ?? [])}
            error={errors.department?.message}
            disabled={optionsPending}
          />
        )}
      />
      <Controller
        name="accessLevel"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Access Level"
            placeholder="Access Level"
            value={field.value}
            onChange={field.onChange}
            options={toOptions(ACCESS_LEVELS)}
            error={errors.accessLevel?.message}
          />
        )}
      />
    </div>
  );
}
