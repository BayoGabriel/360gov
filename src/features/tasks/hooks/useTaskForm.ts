import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateTask, useUpdateTask } from '../queries/tasks.mutations';
import { taskFormSchema } from '../schemas/tasks.schemas';
import type { TaskFormValues } from '../schemas/tasks.schemas';
import type { TaskRecord } from '../types/tasks.types';

export function useTaskForm(task: TaskRecord | null, onDone: () => void) {
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
    mutation.mutate(values, { onSuccess: onDone });
  });

  return {
    form,
    submit,
    isPending: mutation.isPending,
    isError: mutation.isError,
  };
}
