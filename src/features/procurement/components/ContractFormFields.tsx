import { Controller } from 'react-hook-form';
import type { UseFormRegisterReturn, UseFormReturn } from 'react-hook-form';
import { InputField, SelectField } from '../../../shared/components/FormField';
import fieldStyles from '../../../shared/components/FormField/fields.module.css';
import type { ContractFormValues } from '../schemas/procurement.schemas';
import type {
  ContractCategory,
  ContractFilterOptions,
  ProcurementMethod,
} from '../types/procurement.types';
import {
  categoryLabel,
  methodLabel,
} from '../utils/procurement-formatters';
import styles from './procurement.module.css';

interface TypedFieldProps {
  label: string;
  type: 'date' | 'number';
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

function TypedField({
  label,
  type,
  placeholder,
  error,
  registration,
}: TypedFieldProps) {
  return (
    <label className={fieldStyles.field}>
      <span className={fieldStyles.label}>{label}</span>
      <input
        type={type}
        className={`${fieldStyles.input} ${error ? fieldStyles.invalid : ''}`}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        {...registration}
      />
      {error ? (
        <p className={fieldStyles.error} role="alert">
          {error}
        </p>
      ) : null}
    </label>
  );
}

interface ContractFormFieldsProps {
  form: UseFormReturn<ContractFormValues>;
  options?: ContractFilterOptions;
  optionsPending: boolean;
}

const CATEGORY_OPTIONS: ContractCategory[] = [
  'goods',
  'works',
  'services',
  'consultancy',
];

const METHOD_OPTIONS: ProcurementMethod[] = [
  'open-tender',
  'selective-tender',
  'direct-procurement',
  'request-for-quotation',
];

export function ContractFormFields({
  form,
  options,
  optionsPending,
}: ContractFormFieldsProps) {
  const { register, control, formState } = form;
  const errors = formState.errors;
  const toOptions = (values: string[]) =>
    values.map((value) => ({ value, label: value }));

  return (
    <div className={styles.formGrid}>
      <div className={styles.formGridFull}>
        <InputField
          label="Contract Title"
          placeholder="e.g. Supply of 1,200 Office Workstations"
          registration={register('title')}
          error={errors.title?.message}
        />
      </div>
      <div className={styles.formGridFull}>
        <InputField
          label="What you need done or supplied"
          placeholder="Describe the goods, works or services, specifications and delivery expectations"
          multiline
          registration={register('description')}
          error={errors.description?.message}
        />
      </div>
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Category"
            placeholder="Select category"
            value={field.value}
            onChange={field.onChange}
            options={CATEGORY_OPTIONS.map((value) => ({
              value,
              label: categoryLabel(value),
            }))}
            error={errors.category?.message}
          />
        )}
      />
      <Controller
        name="method"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Procurement Method"
            placeholder="Select method"
            value={field.value}
            onChange={field.onChange}
            options={METHOD_OPTIONS.map((value) => ({
              value,
              label: methodLabel(value),
            }))}
            error={errors.method?.message}
          />
        )}
      />
      <Controller
        name="department"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Department"
            placeholder="Select department"
            value={field.value}
            onChange={field.onChange}
            options={toOptions(options?.departments ?? [])}
            error={errors.department?.message}
            disabled={optionsPending}
          />
        )}
      />
      <TypedField
        label="Estimated Value (₦)"
        type="number"
        placeholder="e.g. 145000000"
        registration={register('budget')}
        error={errors.budget?.message}
      />
      <TypedField
        label="Submission Deadline"
        type="date"
        registration={register('submissionDeadline')}
        error={errors.submissionDeadline?.message}
      />
    </div>
  );
}
