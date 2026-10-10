import { useState } from 'react';
import { Search } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { useForwardDocument } from '../queries/documents.mutations';
import { useForwardRecipients } from '../queries/documents.queries';
import type { FileRecord } from '../types/documents.types';
import styles from './documents.module.css';

interface ForwardDialogProps {
  document: FileRecord;
  onClose: () => void;
}

export function ForwardDialog({ document, onClose }: ForwardDialogProps) {
  const [search, setSearch] = useState('');
  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set());
  const recipientsQuery = useForwardRecipients(true);
  const forward = useForwardDocument(document.id);

  const recipients = (recipientsQuery.data ?? []).filter((recipient) =>
    `${recipient.name} ${recipient.title}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const send = () => {
    forward.mutate([...checked], { onSuccess: onClose });
  };

  return (
    <Modal open onClose={onClose} title="Forward to">
      <div className={styles.dialogBody}>
        <label className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search"
            aria-label="Search recipients"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <ul className={styles.recipientList}>
          {recipientsQuery.isPending ? (
            <li className={styles.recipientMeta}>Loading recipients…</li>
          ) : (
            recipients.map((recipient) => (
              <li key={recipient.id}>
                <label className={styles.recipient}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={checked.has(recipient.id)}
                    onChange={() => toggle(recipient.id)}
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
        {forward.isError ? (
          <p className={styles.errorText} role="alert">
            The file could not be forwarded. Please try again.
          </p>
        ) : null}
        <div className={styles.dialogActions}>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={checked.size === 0 || forward.isPending}
            onClick={send}
          >
            Send
          </button>
        </div>
      </div>
    </Modal>
  );
}
