import { Link } from 'react-router';
import { Button } from '../../../shared/components/Button';
import { TextField } from '../../../shared/components/FormField';
import { ROUTES } from '../../../shared/constants/routes';
import { useForgotPasswordPage } from '../hooks/useForgotPasswordPage';
import { AuthFormHeader } from './AuthFormHeader';
import styles from './auth.module.css';

export function ForgotPasswordPage() {
  const { form, submit, isPending, errorMessage } = useForgotPasswordPage();
  const { register, formState } = form;

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <AuthFormHeader
        title="Forget Password"
        description="Lorem ipsum dolor sit amet consectetur. Tellus pulvinar cras sed posuere duis.Velit euismod quis sed ut quis."
      />
      <div className={styles.fields}>
        <TextField
          label="Email address or Gov I.D"
          placeholder="Email Address/ Gov I.D"
          autoComplete="username"
          error={formState.errors.identifier?.message}
          {...register('identifier')}
        />
      </div>
      <p className={styles.footerRow}>
        Remember password ?, <Link to={ROUTES.login}>Login</Link>
      </p>
      {errorMessage ? (
        <p className={styles.errorText} role="alert">
          {errorMessage}
        </p>
      ) : null}
      <div>
        <Button type="submit" isLoading={isPending}>
          Send
        </Button>
      </div>
    </form>
  );
}
