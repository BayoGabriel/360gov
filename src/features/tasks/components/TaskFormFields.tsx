import { Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { AiAssist } from '../../../shared/components/AiAssist';
import { InputField, SelectField } from '../../../shared/components/FormField';
import type { TaskFormValues } from '../schemas/tasks.schemas';
import type { TaskFormOptions } from '../types/tasks.types';
import { TaskAttachmentField } from './TaskAttachmentField';
import { TaskPriorityPicker } from './TaskPriorityPicker';
import styles from './tasks.module.css';

interface TaskFormFieldsProps {
  form: UseFormReturn<TaskFormValues>;
  options?: TaskFormOptions;
  optionsPending: boolean;
}

export function TaskFormFields({
  form,
  options,
  optionsPending,
}: TaskFormFieldsProps) {
  const { register, control, formState } = form;
  const errors = formState.errors;
  const toOptions = (values: string[]) =>
    values.map((value) => ({ value, label: value }));

  return (
    <div className={styles.formGrid}>
      <InputField
        label="Title"
        placeholder="Title"
        registration={register('title')}
        error={errors.title?.message}
      />
      <div>
        <InputField
          label="Description"
          placeholder="Description"
          multiline
          registration={register('description')}
          error={errors.description?.message}
        />
        <AiAssist
          task="draft"
          purpose="task-description"
          subject={form.watch('title') || 'New task'}
          context={`Department: ${form.watch('department') || 'unassigned'}. Assignee: ${form.watch('assignee') || 'unassigned'}.`}
          variant="link"
          onApply={(text) =>
            form.setValue('description', text, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      </div>
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
        name="assignee"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Assignee"
            placeholder="Assignee"
            value={field.value}
            onChange={field.onChange}
            options={toOptions(
              (options?.assignees ?? []).map((assignee) => assignee.name),
            )}
            error={errors.assignee?.message}
            disabled={optionsPending}
          />
        )}
      />
      <Controller
        name="attachmentName"
        control={control}
        render={({ field }) => (
          <TaskAttachmentField
            fileName={field.value ?? ''}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="priorities"
        control={control}
        render={({ field }) => (
          <TaskPriorityPicker
            value={field.value}
            onChange={field.onChange}
            error={errors.priorities?.message}
          />
        )}
      />
    </div>
  );
}
