import { ExternalLink, Info } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { useDriveItem } from '../queries/workspace.queries';
import styles from './workspace.module.css';

interface DocViewerDialogProps {
  itemId: string;
  onClose: () => void;
}

/**
 * Embedded Docs/Sheets viewer. In production the backend supplies
 * `embedUrl` (a Google /preview URL) which we render in an iframe —
 * the officer's own Google session controls access. The dev stub has no
 * real URL, so it renders the simulated `body` instead.
 */
export function DocViewerDialog({ itemId, onClose }: DocViewerDialogProps) {
  const { data: item, isPending } = useDriveItem(itemId);

  return (
    <Modal
      open
      onClose={onClose}
      title={item?.name ?? 'File'}
      className={styles.viewerDialog}
    >
      <div className={styles.viewerBody}>
        {isPending ? (
          <p className={styles.status}>Loading file…</p>
        ) : item?.embedUrl ? (
          <>
            <iframe
              className={styles.viewerFrame}
              src={item.embedUrl}
              title={item.name}
              allow="autoplay"
            />
            <a
              className={styles.viewerMeta}
              href={item.embedUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={13} aria-hidden="true" />
              Open in Google Workspace
            </a>
          </>
        ) : item?.body ? (
          <>
            <div className={styles.docSurface}>
              <div className={styles.docPage}>{item.body}</div>
            </div>
            <p className={styles.viewerNote}>
              <Info size={13} aria-hidden="true" />
              Simulated preview — in production this renders the live Google
              document.
            </p>
          </>
        ) : (
          <p className={styles.status}>
            No inline preview is available for this file type.
          </p>
        )}
      </div>
    </Modal>
  );
}
