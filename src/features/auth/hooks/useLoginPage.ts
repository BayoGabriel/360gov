import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../../app/providers/auth-context';
import { toApiError } from '../../../shared/api/api-error';
import { ROUTES } from '../../../shared/constants/routes';
import { useLoginMutation } from '../queries/auth.mutations';
import { loginSchema } from '../schemas/auth.schemas';
import type { LoginFormValues } from '../schemas/auth.schemas';

export function useLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthenticated } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '', rememberMe: true },
  });
  const mutation = useLoginMutation();

  const submit = form.handleSubmit((values) => {
    mutation.mutate(values, {
      onSuccess: ({ user }) => {
        setAuthenticated(user);
        const state = location.state as { from?: string } | null;
        navigate(state?.from ?? ROUTES.dashboard, { replace: true });
      },
    });
  });

  return {
    form,
    submit,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? toApiError(mutation.error).message : null,
  };
}
