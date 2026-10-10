import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { toApiError } from '../../../shared/api/api-error';
import { ROUTES } from '../../../shared/constants/routes';
import {
  useForgotPasswordMutation,
  useVerifyCodeMutation,
} from '../queries/auth.mutations';
import { verifyCodeSchema } from '../schemas/auth.schemas';
import type { VerifyCodeFormValues } from '../schemas/auth.schemas';

interface VerifyLocationState {
  identifier?: string;
}

export function useVerifyCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const identifier =
    (location.state as VerifyLocationState | null)?.identifier ?? '';

  const form = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: '' },
  });
  const verifyMutation = useVerifyCodeMutation();
  const resendMutation = useForgotPasswordMutation();

  const submit = form.handleSubmit(({ code }) => {
    verifyMutation.mutate(
      { identifier, code },
      {
        onSuccess: () =>
          navigate(ROUTES.resetPassword, { state: { identifier, code } }),
      },
    );
  });

  const resend = () => {
    if (identifier) resendMutation.mutate({ identifier });
  };

  return {
    form,
    submit,
    resend,
    identifier,
    isPending: verifyMutation.isPending,
    isResending: resendMutation.isPending,
    resent: resendMutation.isSuccess,
    errorMessage: verifyMutation.error
      ? toApiError(verifyMutation.error).message
      : null,
  };
}
