import styles from './settings.module.css';

interface SettingsActionsProps {
  saveLabel: string;
  isPending: boolean;
  isDirty: boolean;
  onCancel: () => void;
}

export function SettingsActions({
  saveLabel,
  isPending,
  isDirty,
  onCancel,
}: SettingsActionsProps) {
  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.cancelButton}
        onClick={onCancel}
        disabled={isPending}
      >
        Cancel
      </button>
      <button
        type="submit"
        className={styles.saveButton}
        disabled={isPending || !isDirty}
      >
        {isPending ? 'Saving…' : saveLabel}
      </button>
    </div>
  );
}
