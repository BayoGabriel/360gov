import { useState } from 'react';
import { Search } from 'lucide-react';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { Modal } from '../../../shared/components/Modal';
import { useToast } from '../../../shared/components/Toast';
import { useRequestRevision } from '../queries/documents.mutations';
import { useForwardRecipients } from '../queries/documents.queries';
import type { FileRecord } from '../types/documents.types';
import { FileSummaryCard } from './FileSummaryCard';
import styles from './documents.module.css';

interface RequestRevisionDialogProps {
  document: FileRecord;
  onClose: () => void;
}

export function RequestRevisionDialog({
  document,
  onClose,
}: RequestRevisionDialogProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const recipientsQuery = useForwardRecipients(true);
  const revision = useRequestRevision();
  const toast = useToast();

  const staff = (recipientsQuery.data ?? []).filter((recipient) =>
    `${recipient.name} ${recipient.title}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  const selectedStaff = staff.find((s) => s.id === selected);

  const send = () => {
    if (!selected) return;
    revision.mutate(
      { fileId: document.id, staffId: selected, note: note.trim() },
      {
        onSuccess: () => {
          toast.success(
            `Revision requested on ${document.fileNo}${
              selectedStaff ? ` for ${selectedStaff.name}` : ''
            }.`,
          );
          onClose();
        },
        onError: () => toast.error('The revision request could not be sent.'),
      },
    );
  };

  return (
    <Modal open onClose={onClose} title="Request Revision">
      <div className={styles.dialogBody}>
        <FileSummaryCard document={document} />
        <div className={styles.field}>
          <span className={styles.fieldLabel} id="revision-staff-label">
            Revision applies to
          </span>
          <label className={styles.searchBox}>
            <Search
              size={16}
              className={styles.searchIcon}
              aria-hidden="true"
            />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Select staff"
              aria-labelledby="revision-staff-label"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>
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
                    name="revision-staff"
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
        <div className={styles.field}>
          <span className={styles.fieldLabel} id="revision-note-label">
            Revisions expected
          </span>
          <div className={styles.composer}>
            <textarea
              className={styles.noteArea}
              placeholder="Describe the revisions you expect…"
              aria-labelledby="revision-note-label"
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
        </div>
        {revision.isError ? (
          <p className={styles.errorText} role="alert">
            The revision request could not be sent. Please try again.
          </p>
        ) : null}
        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={!selected || revision.isPending}
            onClick={send}
          >
            Request Revision
          </button>
        </div>
      </div>
    </Modal>
  );
}
