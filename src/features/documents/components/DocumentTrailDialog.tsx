import { Search } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { Modal } from '../../../shared/components/Modal';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import { useApprovalTrail } from '../queries/documents.queries';
import type { FileRecord } from '../types/documents.types';
import styles from './documents.module.css';

interface DocumentTrailDialogProps {
  document: FileRecord;
  onClose: () => void;
}

export function DocumentTrailDialog({
  document,
  onClose,
}: DocumentTrailDialogProps) {
  const trail = useApprovalTrail(document.id);
  const [search, setSearch] = useState('');

  const entries = (trail.data ?? []).filter((entry) =>
    `${entry.actor.name} ${entry.action}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <Modal open onClose={onClose} title="Approval Trail">
      <div className={styles.dialogBody}>
        <label className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search"
            aria-label="Search approval trail"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        {trail.isPending ? (
          <p className={styles.recipientMeta}>Loading trail…</p>
        ) : trail.isError ? (
          <p className={styles.errorText} role="alert">
            The approval trail could not be loaded.
          </p>
        ) : (
          <ul className={styles.trailPeople}>
            {entries.map((entry) => (
              <li key={entry.id} className={styles.trailPerson}>
                <Avatar
                  name={entry.actor.name}
                  src={entry.actor.avatarUrl}
                  size={36}
                />
                <span>
                  <span className={styles.personName}>{entry.actor.name}</span>
                  <span className={styles.trailMeta}>
                    {entry.action} · {formatListTimestamp(entry.timestamp)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
