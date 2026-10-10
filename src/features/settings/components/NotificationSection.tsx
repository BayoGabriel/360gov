import { Bell } from 'lucide-react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { FormRow } from './FormRow';
import { ToggleSwitch } from './ToggleSwitch';
import styles from './settings.module.css';

interface NotificationSectionProps {
  registration: UseFormRegisterReturn;
}

export function NotificationSection({
  registration,
}: NotificationSectionProps) {
  return (
    <FormRow label="Notification" hint="Share a few snippets of your work.">
      <label className={styles.toggleRow}>
        <Bell size={18} className={styles.toggleIcon} aria-hidden="true" />
        <span className={styles.toggleLabel}>Mute Notification</span>
        <ToggleSwitch label="Mute Notification" registration={registration} />
      </label>
    </FormRow>
  );
}
