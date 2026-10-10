import type { UseFormRegisterReturn } from 'react-hook-form';
import styles from './fields.module.css';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  registration: UseFormRegisterReturn;
}

/** Labeled light-theme text input/textarea wired to React Hook Form. */
export function InputField({
  label,
  placeholder,
  error,
  multiline,
  registration,
}: InputFieldProps) {
  const className = `${multiline ? styles.textarea : styles.input} ${error ? styles.invalid : ''}`;
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {multiline ? (
        <textarea
          className={className}
          placeholder={placeholder}
          rows={4}
          aria-invalid={error ? true : undefined}
          {...registration}
        />
      ) : (
        <input
          className={className}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          {...registration}
        />
      )}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </label>
  );
}
