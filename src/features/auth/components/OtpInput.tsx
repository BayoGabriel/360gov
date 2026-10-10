import { useOtpInput } from '../hooks/useOtpInput';
import styles from './auth.module.css';

interface OtpInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: string;
}

export function OtpInput({
  length,
  value,
  onChange,
  onComplete,
  error,
}: OtpInputProps) {
  const { digits, setRef, handleChange, handleKeyDown, handlePaste } =
    useOtpInput({ length, value, onChange, onComplete });

  return (
    <div>
      <div
        className={styles.otpRow}
        role="group"
        aria-label={`${length}-digit verification code`}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={setRef(index)}
            className={`${styles.otpBox} ${error ? styles.invalid : ''}`}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            aria-label={`Digit ${index + 1}`}
            aria-invalid={error ? true : undefined}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
          />
        ))}
      </div>
      {error ? (
        <p className={styles.errorText} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
