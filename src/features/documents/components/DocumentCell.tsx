import { Folder } from 'lucide-react';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import type {
  FilePriority,
  FileRecord,
  FileStatus,
  Person,
} from '../types/documents.types';
import styles from '../documents.module.css';

export type ColumnKey =
  | 'file'
  | 'initiatedBy'
  | 'attachments'
  | 'holder'
  | 'description'
  | 'reviewers'
  | 'completion'
  | 'assignees'
  | 'module'
  | 'priority'
  | 'status'
  | 'updated';

const STATUS_LABELS: Record<FileStatus, string> = {
  processing: 'Processing',
  success: 'Success',
  declined: 'Declined',
};

const STATUS_TONES: Record<FileStatus, string> = {
  processing: styles.pillBlue,
  success: styles.pillGreen,
  declined: styles.pillRed,
};

const PRIORITY_LABELS: Record<FilePriority, string> = {
  urgent: 'Urgent',
  important: 'Important',
  normal: 'Normal',
};

const PRIORITY_TONES: Record<FilePriority, string> = {
  urgent: styles.pillRed,
  important: styles.pillBlue,
  normal: styles.pillGreen,
};

function PersonCell({ person }: { person: Person }) {
  return (
    <span className={styles.person}>
      <Avatar name={person.name} size={28} />
      <span>
        <span className={styles.personName}>{person.name}</span>
        <span className={styles.personEmail}>{person.email}</span>
      </span>
    </span>
  );
}

function AvatarStack({ people }: { people: Person[] }) {
  const shown = people.slice(0, 3);
  const extra = people.length - shown.length;
  return (
    <span className={styles.avatarStack}>
      {shown.map((p) => (
        <Avatar key={p.email} name={p.name} size={24} />
      ))}
      {extra > 0 && <span className={styles.pillNeutral}>+{extra}</span>}
    </span>
  );
}

export function DocumentCell({
  column,
  row,
}: {
  column: ColumnKey;
  row: FileRecord;
}) {
  switch (column) {
    case 'file':
      return (
        <span>
          <span className={styles.fileNo}>{row.fileNo}</span>
          <span className={styles.fileSubject}>{row.subject}</span>
        </span>
      );
    case 'initiatedBy':
      return <PersonCell person={row.initiatedBy} />;
    case 'attachments':
      return (
        <span className={styles.person}>
          <Folder size={20} className={styles.attachIcon} aria-hidden="true" />
          <span>
            <span className={styles.personName}>{row.attachments.name}</span>
            <span className={styles.personEmail}>{row.attachments.email}</span>
          </span>
        </span>
      );
    case 'holder':
      return <PersonCell person={row.currentHolder} />;
    case 'description':
      return <span className={styles.description}>{row.description}</span>;
    case 'reviewers':
      return <AvatarStack people={row.reviewers} />;
    case 'completion':
      return (
        <span className={`${styles.pill} ${styles.pillNeutral}`}>
          {row.completionPct}%
        </span>
      );
    case 'assignees':
      return <AvatarStack people={row.assignees} />;
    case 'module':
      return <span>{row.module}</span>;
    case 'priority':
      return (
        <span className={`${styles.pill} ${PRIORITY_TONES[row.priority]}`}>
          {PRIORITY_LABELS[row.priority]}
        </span>
      );
    case 'status':
      return (
        <span className={`${styles.pill} ${STATUS_TONES[row.status]}`}>
          {STATUS_LABELS[row.status]}
        </span>
      );
    case 'updated':
      return <span>{formatListTimestamp(row.lastUpdated)}</span>;
  }
}
