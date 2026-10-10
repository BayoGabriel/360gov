import { Controller } from 'react-hook-form';
import { Button } from '../../../shared/components/Button';
import { useVerifyCodePage } from '../hooks/useVerifyCodePage';
import { OTP_LENGTH } from '../schemas/auth.schemas';
import { AuthFormHeader } from './AuthFormHeader';
import { OtpInput } from './OtpInput';
import styles from './auth.module.css';

export function VerifyCodePage() {
  const {
    form,
    submit,
    resend,
    identifier,
    isPending,
    isResending,
    resent,
    errorMessage,
  } = useVerifyCodePage();

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <AuthFormHeader
        title={`Enter the ${OTP_LENGTH}-digit sent to ${identifier || 'your email'}`}
        description="Lorem ipsum dolor sit amet consectetur. Tellus pulvinar cras sed posuere duis.Velit euismod quis sed ut quis."
      />
      <Controller
        control={form.control}
        name="code"
        render={({ field, fieldState }) => (
          <OtpInput
            length={OTP_LENGTH}
            value={field.value}
            onChange={field.onChange}
            onComplete={() => void submit()}
            error={fieldState.error?.message}
          />
        )}
      />
      <p className={styles.footerRow}>
        I didn&apos;t receive code ,{' '}
        <Button
          type="button"
          variant="link"
          onClick={resend}
          disabled={isResending || !identifier}
        >
          Resend Code.
        </Button>
        {resent ? <span role="status"> Sent.</span> : null}
      </p>
      {errorMessage ? (
        <p className={styles.errorText} role="alert">
          {errorMessage}
        </p>
      ) : null}
      {isPending ? (
        <p className={styles.footerRow} role="status">
          Verifying…
        </p>
      ) : null}
    </form>
  );
}
