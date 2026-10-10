import { useSettingsPage } from '../hooks/useSettingsPage';
import { SettingsForm } from './SettingsForm';
import styles from './settings.module.css';

export function SettingsPage() {
  const { profileQuery, optionsQuery } = useSettingsPage();
  const isPending = profileQuery.isPending || optionsQuery.isPending;
  const isError = profileQuery.isError || optionsQuery.isError;
  const refetch = () => {
    void profileQuery.refetch();
    void optionsQuery.refetch();
  };

  return (
    <div className={styles.page}>
      {isPending ? (
        <p className={styles.status} role="status">
          Loading settings…
        </p>
      ) : isError ? (
        <div className={styles.status} role="alert">
          <p>Settings could not be loaded.</p>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={refetch}
          >
            Retry
          </button>
        </div>
      ) : profileQuery.data && optionsQuery.data ? (
        <SettingsForm
          profile={profileQuery.data}
          options={optionsQuery.data}
        />
      ) : null}
    </div>
  );
}
