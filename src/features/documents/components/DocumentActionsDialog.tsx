import { CheckCircle, Eye, FileClock, PenLine, Send } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import type { DocumentAction, FileRecord } from '../types/documents.types';
import styles from '../documents.module.css';

const DOCUMENT_ACTIONS: {
  id: DocumentAction;
  label: string;
  icon: typeof Eye;
}[] = [
  { id: 'view', label: 'View File', icon: Eye },
  { id: 'trail', label: 'Approval Trail', icon: FileClock },
  { id: 'note', label: 'Add Note', icon: PenLine },
  { id: 'forward', label: 'Forward', icon: Send },
  { id: 'approve', label: 'Approve', icon: CheckCircle },
];

interface DocumentActionsDialogProps {
  document: FileRecord;
  onAction: (action: DocumentAction, document: FileRecord) => void;
  onClose: () => void;
}

export function DocumentActionsDialog({
  document,
  onAction,
  onClose,
}: DocumentActionsDialogProps) {
  return (
    <Modal
      open
      onClose={onClose}
      title={`Options for ${document.fileNo}`}
      className={styles.optionsDialog}
      hideHeader
    >
      <ul className={styles.optionsList} role="menu">
        {DOCUMENT_ACTIONS.map(({ id, label, icon: Icon }) => (
          <li key={id} role="none">
            <button
              type="button"
              role="menuitem"
              className={styles.optionsItem}
              onClick={() => onAction(id, document)}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
