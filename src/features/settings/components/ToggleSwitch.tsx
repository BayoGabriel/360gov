import type { UseFormRegisterReturn } from 'react-hook-form';
import styles from './settings.module.css';

interface ToggleSwitchProps {
  label: string;
  registration: UseFormRegisterReturn;
}

/** Native checkbox styled as a switch so it stays keyboard accessible. */
export function ToggleSwitch({ label, registration }: ToggleSwitchProps) {
  return (
    <input
      type="checkbox"
      role="switch"
      className={styles.switchInput}
      aria-label={label}
      {...registration}
    />
  );
}
