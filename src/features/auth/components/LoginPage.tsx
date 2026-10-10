import { Link } from 'react-router';
import { Button } from '../../../shared/components/Button';
import { TextField } from '../../../shared/components/FormField';
import { ROUTES } from '../../../shared/constants/routes';
import { useLoginPage } from '../hooks/useLoginPage';
import { AuthFormHeader } from './AuthFormHeader';
import styles from './auth.module.css';

export function LoginPage() {
  const { form, submit, isPending, errorMessage } = useLoginPage();
  const { register, formState } = form;

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <AuthFormHeader
        title="Login"
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
        <TextField
          label="Password"
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          error={formState.errors.password?.message}
          {...register('password')}
        />
      </div>
      <label className={styles.checkboxRow}>
        <input type="checkbox" {...register('rememberMe')} />
        Remember me
      </label>
      <Link to={ROUTES.forgotPassword} className={styles.dangerLink}>
        Forget password
      </Link>
      {errorMessage ? (
        <p className={styles.errorText} role="alert">
          {errorMessage}
        </p>
      ) : null}
      <div>
        <Button type="submit" isLoading={isPending}>
          Login
        </Button>
      </div>
    </form>
  );
}
