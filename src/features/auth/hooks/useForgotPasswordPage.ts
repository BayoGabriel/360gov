import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toApiError } from '../../../shared/api/api-error';
import { ROUTES } from '../../../shared/constants/routes';
import { useForgotPasswordMutation } from '../queries/auth.mutations';
import { forgotPasswordSchema } from '../schemas/auth.schemas';
import type { ForgotPasswordFormValues } from '../schemas/auth.schemas';

export function useForgotPasswordPage() {
  const navigate = useNavigate();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identifier: '' },
  });
  const mutation = useForgotPasswordMutation();

  const submit = form.handleSubmit(({ identifier }) => {
    mutation.mutate(
      { identifier },
      {
        onSuccess: () =>
          navigate(ROUTES.verifyCode, { state: { identifier } }),
      },
    );
  });

  return {
    form,
    submit,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? toApiError(mutation.error).message : null,
  };
}
