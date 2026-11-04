import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { useCreateFolder } from '../queries/workspace.mutations';
import styles from './workspace.module.css';

interface NewFolderDialogProps {
  parentId: string | null;
  onClose: () => void;
}

export function NewFolderDialog({ parentId, onClose }: NewFolderDialogProps) {
  const [name, setName] = useState('');
  const createFolder = useCreateFolder();

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed || createFolder.isPending) return;
    createFolder.mutate({ parentId, name: trimmed }, { onSuccess: onClose });
  };

  return (
    <Modal open onClose={onClose} title="New folder">
      <div className={styles.dialogBody}>
        <input
          className={styles.input}
          type="text"
          placeholder="Folder name"
          aria-label="Folder name"
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submit();
          }}
        />
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={!name.trim() || createFolder.isPending}
            onClick={submit}
          >
            <FolderPlus size={15} aria-hidden="true" />
            {createFolder.isPending ? 'Creating…' : 'Create folder'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
