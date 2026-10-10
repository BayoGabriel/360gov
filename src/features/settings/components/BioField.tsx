import { useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { BIO_MAX_LENGTH } from '../schemas/settings.schemas';
import type { ProfileFormValues } from '../schemas/settings.schemas';
import { BioToolbar } from './BioToolbar';
import styles from './settings.module.css';

interface BioFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function BioField({ form }: BioFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const registration = form.register('bio');
  const bio = form.watch('bio') ?? '';
  const error = form.formState.errors.bio?.message;
  const remaining = Math.max(0, BIO_MAX_LENGTH - bio.length);

  const syncFromDom = () => {
    const el = textareaRef.current;
    if (el) {
      form.setValue('bio', el.value, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <div className={styles.bio}>
      <BioToolbar textareaRef={textareaRef} onMutate={syncFromDom} />
      <textarea
        {...registration}
        ref={(el) => {
          registration.ref(el);
          textareaRef.current = el;
        }}
        className={`${styles.textarea} ${error ? styles.invalid : ''}`}
        rows={4}
        maxLength={BIO_MAX_LENGTH}
        aria-label="Bio"
        aria-invalid={error ? true : undefined}
      />
      {error ? (
        <p className={styles.errorText} role="alert">
          {error}
        </p>
      ) : null}
      <p className={styles.bioCount}>{remaining} characters left</p>
    </div>
  );
}
