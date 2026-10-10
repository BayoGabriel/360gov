import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateUser } from '../queries/users.mutations';
import { addUserSchema } from '../schemas/users.schemas';
import type { AddUserFormValues } from '../schemas/users.schemas';

export function useAddUserForm(onDone: () => void) {
  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      fullName: '',
      email: '',
      department: '',
      accessLevel: '',
    },
  });
  const createUser = useCreateUser();

  const submit = form.handleSubmit((values) => {
    createUser.mutate(values, { onSuccess: onDone });
  });

  return {
    form,
    submit,
    isPending: createUser.isPending,
    isError: createUser.isError,
  };
}
