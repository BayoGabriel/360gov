import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible label; also rendered in the header unless `hideHeader`. */
  title: string;
  /** Extra class applied to the <dialog> element (e.g. a wider panel). */
  className?: string;
  /** Hide the built-in header when the content renders its own. */
  hideHeader?: boolean;
  children: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  className,
  hideHeader,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${className ?? ''}`}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      {hideHeader ? null : (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            type="button"
            className={styles.close}
            aria-label="Close"
            onClick={onClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      )}
      {children}
    </dialog>
  );
}
