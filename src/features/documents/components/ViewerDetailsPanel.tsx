import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { formatUploadedAt } from '../../../shared/lib/format-date';
import { formatFileSize } from '../../../shared/lib/format-file-size';
import type { FileRecord, Person } from '../types/documents.types';
import styles from './documents.module.css';

function AvatarStack({ people }: { people: Person[] }) {
  const shown = people.slice(0, 5);
  return (
    <span className={styles.avatarStack}>
      {shown.map((p) => (
        <Avatar key={p.email} name={p.name} src={p.avatarUrl} size={20} />
      ))}
      {people.length > shown.length ? (
        <span className={styles.stackExtra}>+{people.length - shown.length}</span>
      ) : null}
    </span>
  );
}

interface ViewerDetailsPanelProps {
  document: FileRecord;
  commentsCount: number;
  commenters: Person[];
  onShowApprovers: () => void;
  onShowComments: () => void;
  onCollapse: () => void;
}

export function ViewerDetailsPanel({
  document,
  commentsCount,
  commenters,
  onShowApprovers,
  onShowComments,
  onCollapse,
}: ViewerDetailsPanelProps) {
  return (
    <aside className={styles.viewerDetails} aria-label="File Details">
      <h2 className={styles.fileDetailsTitle}>File Details</h2>
      <dl className={styles.metaList}>
        <div className={styles.metaRow}>
          <dt>Version</dt>
          <dd>1</dd>
        </div>
        <div className={styles.metaRow}>
          <dt>File Size</dt>
          <dd>{formatFileSize(document.fileSizeBytes)}</dd>
        </div>
        <div className={styles.metaRow}>
          <dt>Uploaded by</dt>
          <dd>{document.initiatedBy.name}</dd>
        </div>
        <button
          type="button"
          className={styles.metaButton}
          onClick={onShowApprovers}
        >
          <span className={styles.metaLabel}>Approved by</span>
          <AvatarStack people={document.approvedBy} />
        </button>
        <div className={styles.metaRow}>
          <dt>Date Uploaded</dt>
          <dd>{formatUploadedAt(document.uploadedAt)}</dd>
        </div>
        <button
          type="button"
          className={styles.metaButton}
          onClick={onShowComments}
        >
          <span className={styles.metaLabel}>Comments {commentsCount}</span>
          <AvatarStack people={commenters} />
        </button>
        <div className={styles.metaRow}>
          <dt>Category</dt>
          <dd>{document.documentType || 'None'}</dd>
        </div>
      </dl>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={onCollapse}
      >
        Collapse Details
      </button>
    </aside>
  );
}
