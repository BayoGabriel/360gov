import { ChevronDown } from 'lucide-react';
import styles from './fields.module.css';

interface SelectFieldProps {
  label: string;
  value: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

/** Labeled light-theme select with chevron affordance. */
export function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
  error,
  disabled,
}: SelectFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <span className={styles.selectWrap}>
        <select
          className={`${styles.select} ${error ? styles.invalid : ''}`}
          value={value}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{placeholder}</option>
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
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </label>
  );
}
