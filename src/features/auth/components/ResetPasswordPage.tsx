import { Button } from '../../../shared/components/Button';
import { TextField } from '../../../shared/components/FormField';
import { useResetPasswordPage } from '../hooks/useResetPasswordPage';
import { AuthFormHeader } from './AuthFormHeader';
import styles from './auth.module.css';

export function ResetPasswordPage() {
  const { form, submit, isPending, errorMessage } = useResetPasswordPage();
  const { register, formState } = form;

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <AuthFormHeader
        title="Set New Password"
        description="Lorem ipsum dolor sit amet consectetur. Tellus pulvinar cras sed posuere duis.Velit euismod quis sed ut quis."
      />
      <div className={styles.fields}>
        <TextField
          label="New password"
          placeholder="New Password"
          type="password"
          autoComplete="new-password"
          error={formState.errors.newPassword?.message}
          {...register('newPassword')}
        />
        <TextField
          label="Confirm password"
          placeholder="Confirm Password"
          type="password"
          autoComplete="new-password"
          error={formState.errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>
      {errorMessage ? (
        <p className={styles.errorText} role="alert">
          {errorMessage}
        </p>
      ) : null}
      <div>
        <Button type="submit" isLoading={isPending}>
          Save
        </Button>
      </div>
    </form>
  );
}
