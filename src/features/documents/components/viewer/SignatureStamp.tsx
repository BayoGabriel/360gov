import type { CSSProperties } from 'react';
import { formatListTimestamp } from '../../../../shared/lib/format-date';
import type { SignaturePlacement } from '../../types/documents.types';
import styles from '../../documents.module.css';

interface SignatureStampProps {
  placement: Pick<
    SignaturePlacement,
    'x' | 'y' | 'width' | 'imageDataUrl' | 'signer' | 'signedAt'
  >;
  /** Pending stamps are being positioned; they get a dashed guide. */
  pending?: boolean;
  /** Optional caption override (e.g. while placing a signature). */
  caption?: string;
}

/**
 * A signature stamped onto the page at normalized coordinates. Rendered
 * inside the page element so it scales with the page's zoom transform.
 */
export function SignatureStamp({
  placement,
  pending,
  caption,
}: SignatureStampProps) {
  const style: CSSProperties = {
    left: `${placement.x * 100}%`,
    top: `${placement.y * 100}%`,
    width: `${placement.width * 100}%`,
  };
  const text =
    caption ??
    `${placement.signer.name} · ${formatListTimestamp(placement.signedAt)}`;

  return (
    <figure
      className={`${styles.sigStamp} ${pending ? styles.sigStampPending : ''}`}
      style={style}
      data-stamp
    >
      <img
        src={placement.imageDataUrl}
        alt={
          pending
            ? 'Signature being placed'
            : `Signature of ${placement.signer.name}`
        }
        draggable={false}
      />
      <figcaption>{text}</figcaption>
    </figure>
  );
}
