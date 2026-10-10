import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { Modal } from '../../../shared/components/Modal';
import type { FileRecord } from '../types/documents.types';
import styles from './documents.module.css';

interface ApproversDialogProps {
  document: FileRecord;
  onClose: () => void;
}

export function ApproversDialog({ document, onClose }: ApproversDialogProps) {
  return (
    <Modal open onClose={onClose} title="Approved by">
      <div className={styles.dialogBody}>
        <ul className={styles.trailPeople}>
          {document.approvedBy.map((person) => (
            <li key={person.email} className={styles.trailPerson}>
              <Avatar name={person.name} size={36} />
              <span>
                <span className={styles.personName}>{person.name}</span>
                <span className={styles.trailMeta}>{person.email}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
