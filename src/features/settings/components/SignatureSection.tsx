import { useState } from 'react';
import { PenLine, Star, Trash2 } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import {
  SignaturePad,
  type SignatureDraft,
} from '../../../shared/components/SignaturePad';
import { useSignatureSection } from '../hooks/useSignatureSection';
import { FormRow } from './FormRow';
import styles from './settings.module.css';

const SOURCE_LABELS = {
  drawn: 'Drawn',
  typed: 'Typed',
  uploaded: 'Uploaded',
} as const;

/**
 * Signature management: the user's stored signatures, their default stamp,
 * and a pad for capturing new ones — used when approving documents that
 * require sign-off.
 */
export function SignatureSection() {
  const section = useSignatureSection();
  const [draft, setDraft] = useState<SignatureDraft | null>(null);

  return (
    <FormRow
      label="Signature"
      hint="Used to sign documents that require your approval."
    >
      <div className={styles.signatureList}>
        {section.isPending ? (
          <p className={styles.rowHint} role="status">
            Loading signatures…
          </p>
        ) : null}
        {section.isError ? (
          <p className={styles.errorText} role="alert">
            Signatures could not be loaded.
          </p>
        ) : null}
        {section.signatures.map((signature) => (
          <div key={signature.id} className={styles.signatureItem}>
            <span className={styles.signaturePreview}>
              <img
                src={signature.imageDataUrl}
                alt={`Signature: ${signature.label}`}
              />
            </span>
            <div className={styles.signatureBody}>
              <p className={styles.signatureLabel}>{signature.label}</p>
              <p className={styles.signatureMeta}>
                {SOURCE_LABELS[signature.source]}
                {signature.isDefault ? ' · Default' : ''}
              </p>
            </div>
            {!signature.isDefault ? (
              <button
                type="button"
                className={styles.signatureAction}
                aria-label={`Make ${signature.label} the default signature`}
                onClick={() => section.makeDefault(signature.id)}
              >
                <Star size={16} aria-hidden="true" />
              </button>
            ) : null}
            <button
              type="button"
              className={styles.signatureAction}
              aria-label={`Delete signature ${signature.label}`}
              onClick={() => section.remove(signature.id)}
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.signatureAdd}
          onClick={section.openPad}
        >
          <PenLine size={16} aria-hidden="true" />
          Add signature
        </button>
      </div>
      {section.padOpen ? (
        <Modal
          open
          onClose={section.closePad}
          title="New signature"
          className={styles.signatureDialog}
        >
          <SignaturePad onChange={setDraft} />
          <div className={styles.signatureDialogActions}>
            <button
              type="button"
              className={styles.saveButton}
              disabled={!draft || section.saving}
              onClick={() => draft && section.save(draft)}
            >
              Save signature
            </button>
          </div>
        </Modal>
      ) : null}
    </FormRow>
  );
}
