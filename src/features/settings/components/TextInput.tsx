import type { InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import styles from './settings.module.css';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: string;
}

export function TextInput({ icon: Icon, error, ...rest }: TextInputProps) {
  const className = [
    styles.input,
    Icon ? styles.inputWithIcon : '',
    error ? styles.invalid : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <span className={styles.inputWrap}>
        {Icon ? (
          <Icon size={16} className={styles.inputIcon} aria-hidden="true" />
        ) : null}
        <input
          className={className}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
      </span>
      {error ? (
        <p className={styles.errorText} role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
