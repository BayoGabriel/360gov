import type { ReactNode } from 'react';
import styles from './settings.module.css';

interface FormRowProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

/** Labelled two-column row: field label/hint on the left, control on the right. */
export function FormRow({ label, hint, children }: FormRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.rowLabel}>
        <span className={styles.rowLabelText}>{label}</span>
        {hint ? <span className={styles.rowHint}>{hint}</span> : null}
      </div>
      <div className={styles.rowControl}>{children}</div>
    </div>
  );
}
