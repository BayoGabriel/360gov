import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { toApiError } from '../../../shared/api/api-error';
import { ROUTES } from '../../../shared/constants/routes';
import { useResetPasswordMutation } from '../queries/auth.mutations';
import { resetPasswordSchema } from '../schemas/auth.schemas';
import type { ResetPasswordFormValues } from '../schemas/auth.schemas';

interface ResetLocationState {
  identifier?: string;
  code?: string;
}

export function useResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResetLocationState | null;

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });
  const mutation = useResetPasswordMutation();

  const submit = form.handleSubmit(({ newPassword }) => {
    mutation.mutate(
      {
        identifier: state?.identifier ?? '',
        code: state?.code ?? '',
        newPassword,
      },
      { onSuccess: () => navigate(ROUTES.login, { replace: true }) },
    );
  });

  return {
    form,
    submit,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? toApiError(mutation.error).message : null,
  };
}
