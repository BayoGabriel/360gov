import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './settings.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  icon?: LucideIcon;
  options: SelectOption[];
  error?: string;
}

export function SelectInput({
  icon: Icon,
  options,
  error,
  value,
  ...rest
}: SelectInputProps) {
  const className = [
    styles.select,
    Icon ? styles.inputWithIcon : '',
    error ? styles.invalid : '',
  ]
    .filter(Boolean)
    .join(' ');
  // Keep the current value visible if its option has not loaded yet.
  const missingValue =
    typeof value === 'string' &&
    value !== '' &&
    !options.some((option) => option.value === value);

  return (
    <>
      <span className={styles.selectWrap}>
        {Icon ? (
          <Icon size={16} className={styles.inputIcon} aria-hidden="true" />
        ) : null}
        <select
          className={className}
          value={value}
          aria-invalid={error ? true : undefined}
          {...rest}
        >
          {missingValue ? <option value={value}>{value}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className={styles.selectIcon}
          aria-hidden="true"
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
