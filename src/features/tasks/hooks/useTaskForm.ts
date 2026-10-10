import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../app/providers/auth-context';
import { useToast } from '../../../shared/components/Toast';
import { useCreateTask, useUpdateTask } from '../queries/tasks.mutations';
import { taskFormSchema } from '../schemas/tasks.schemas';
import type { TaskFormValues } from '../schemas/tasks.schemas';
import type { TaskRecord } from '../types/tasks.types';

export function useTaskForm(task: TaskRecord | null, onDone: () => void) {
  const { session } = useAuth();
  const toast = useToast();
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      department: task?.department ?? '',
      assignee: task?.assignee ?? '',
      attachmentName: task?.attachment?.fileName ?? '',
      priorities: task?.priorities ?? [],
    },
  });
  const createTask = useCreateTask();
  const updateTask = useUpdateTask(task?.id ?? '');
  const mutation = task ? updateTask : createTask;

  const submit = form.handleSubmit((values) => {
    const createdBy =
      session.status === 'authenticated' ? session.user.displayName : undefined;
    mutation.mutate(task ? values : { ...values, createdBy }, {
      onSuccess: () => {
        toast.success(
          task
            ? 'Task updated successfully.'
            : 'Task created successfully.',
        );
        onDone();
      },
      onError: () =>
        toast.error('The task could not be saved. Please try again.'),
    });
  });

  return {
    form,
    submit,
    isPending: mutation.isPending,
    isError: mutation.isError,
  };
}
