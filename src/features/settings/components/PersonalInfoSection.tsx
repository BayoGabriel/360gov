import type { ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { ProfileFormValues } from '../schemas/settings.schemas';
import type { TimeZoneOption } from '../types/settings.types';
import { PersonalInfoFields } from './PersonalInfoFields';
import styles from './settings.module.css';

interface PersonalInfoSectionProps {
  form: UseFormReturn<ProfileFormValues>;
  departments: string[];
  timeZones: TimeZoneOption[];
  photoUrl?: string;
  displayName: string;
  onPhoto: (file: File) => void;
  actions: ReactNode;
}

export function PersonalInfoSection({
  form,
  departments,
  timeZones,
  photoUrl,
  displayName,
  onPhoto,
  actions,
}: PersonalInfoSectionProps) {
  return (
    <section>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Personal info</h2>
          <p className={styles.sectionHint}>
            Update your photo and personal details here.
          </p>
        </div>
        {actions}
      </div>
      <PersonalInfoFields
        form={form}
        departments={departments}
        timeZones={timeZones}
        photoUrl={photoUrl}
        displayName={displayName}
        onPhoto={onPhoto}
      />
    </section>
  );
}
