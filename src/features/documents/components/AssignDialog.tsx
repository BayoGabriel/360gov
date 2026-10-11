import { useState } from 'react';
import { Search } from 'lucide-react';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { Modal } from '../../../shared/components/Modal';
import { useToast } from '../../../shared/components/Toast';
import { useAssignDocument } from '../queries/documents.mutations';
import { useForwardRecipients } from '../queries/documents.queries';
import type { FileRecord } from '../types/documents.types';
import { FileSummaryCard } from './FileSummaryCard';
import styles from './documents.module.css';

interface AssignDialogProps {
  document: FileRecord;
  onClose: () => void;
}

export function AssignDialog({ document, onClose }: AssignDialogProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const recipientsQuery = useForwardRecipients(true);
  const assign = useAssignDocument(document.id);
  const toast = useToast();

  const staff = (recipientsQuery.data ?? []).filter((recipient) =>
    `${recipient.name} ${recipient.title}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  const selectedStaff = staff.find((s) => s.id === selected);

  const send = () => {
    if (!selected) return;
    assign.mutate(selected, {
      onSuccess: () => {
        toast.success(
          `${document.fileNo} assigned${
            selectedStaff ? ` to ${selectedStaff.name}` : ''
          }.`,
        );
        onClose();
      },
      onError: () => toast.error('The file could not be assigned.'),
    });
  };

  return (
    <Modal open onClose={onClose} title="Assign to">
      <div className={styles.dialogBody}>
        <FileSummaryCard document={document} />
        <label className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search staff"
            aria-label="Search staff"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <ul className={styles.recipientList} role="listbox" aria-label="Staff">
          {recipientsQuery.isPending ? (
            <li className={styles.recipientMeta}>Loading staff…</li>
          ) : staff.length === 0 ? (
            <li className={styles.recipientMeta}>No staff match.</li>
          ) : (
            staff.map((recipient) => (
              <li key={recipient.id}>
                <label className={styles.recipient}>
                  <input
                    type="radio"
                    name="assign-staff"
                    className={styles.checkbox}
                    checked={selected === recipient.id}
                    onChange={() => setSelected(recipient.id)}
                  />
                  <Avatar
                    name={recipient.name}
                    src={recipient.avatarUrl}
                    size={32}
                  />
                  <span>
                    <span className={styles.personName}>{recipient.name}</span>
                    <span className={styles.personEmail}>{recipient.title}</span>
                  </span>
                </label>
              </li>
            ))
          )}
        </ul>
        {assign.isError ? (
          <p className={styles.errorText} role="alert">
            The file could not be assigned. Please try again.
          </p>
        ) : null}
        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={!selected || assign.isPending}
            onClick={send}
          >
            Assign
          </button>
        </div>
      </div>
    </Modal>
  );
}
