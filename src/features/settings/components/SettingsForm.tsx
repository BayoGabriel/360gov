import { useProfileForm } from '../hooks/useProfileForm';
import type { ProfileSettings, SettingsOptions } from '../types/settings.types';
import { NotificationSection } from './NotificationSection';
import { PersonalInfoSection } from './PersonalInfoSection';
import { SettingsActions } from './SettingsActions';
import { WorkflowUploadsSection } from './WorkflowUploadsSection';
import styles from './settings.module.css';

interface SettingsFormProps {
  profile: ProfileSettings;
  options: SettingsOptions;
}

export function SettingsForm({ profile, options }: SettingsFormProps) {
  const {
    form,
    photo,
    submit,
    cancel,
    isPending,
    isError,
    isSaved,
    isDirty,
  } = useProfileForm(profile);

  return (
    <form className={styles.card} onSubmit={submit} noValidate>
      <PersonalInfoSection
        form={form}
        departments={options.departments}
        timeZones={options.timeZones}
        photoUrl={photo.previewUrl}
        displayName={`${profile.firstName} ${profile.lastName}`}
        onPhoto={photo.setFile}
        actions={
          <SettingsActions
            saveLabel="Save"
            isPending={isPending}
            isDirty={isDirty}
            onCancel={cancel}
          />
        }
      />
      <NotificationSection
        registration={form.register('notificationsMuted')}
      />
      <WorkflowUploadsSection />
      <div className={styles.footer}>
        {isError ? (
          <p className={styles.formError} role="alert">
            Your settings could not be saved. Please try again.
          </p>
        ) : null}
        {isSaved && !isDirty ? (
          <p className={styles.savedText} role="status">
            Changes saved.
          </p>
        ) : null}
        <SettingsActions
          saveLabel="Save Changes"
          isPending={isPending}
          isDirty={isDirty}
          onCancel={cancel}
        />
      </div>
    </form>
  );
}
