import { useState } from 'react';
import { Image, Paperclip, Smile } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { useToast } from '../../../shared/components/Toast';
import { useAddNote } from '../queries/documents.mutations';
import type { FileRecord } from '../types/documents.types';
import { FileSummaryCard } from './FileSummaryCard';
import styles from './documents.module.css';

interface AddNoteDialogProps {
  document: FileRecord;
  onClose: () => void;
}

export function AddNoteDialog({ document, onClose }: AddNoteDialogProps) {
  const [note, setNote] = useState('');
  const addNote = useAddNote(document.id);
  const toast = useToast();

  const send = () => {
    if (!note.trim()) return;
    addNote.mutate(note.trim(), {
      onSuccess: () => {
        toast.success(`Note added to ${document.fileNo}.`);
        onClose();
      },
      onError: () => toast.error('The note could not be sent.'),
    });
  };

  return (
    <Modal open onClose={onClose} title="Add Note">
      <div className={styles.dialogBody}>
        <FileSummaryCard document={document} />
        <div className={styles.composer}>
          <textarea
            className={styles.noteArea}
            placeholder="Write a note"
            aria-label="Write a note"
            rows={6}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <div className={styles.composerBar}>
            <span className={styles.composerIcons}>
              <Smile size={18} aria-hidden="true" />
              <Paperclip size={18} aria-hidden="true" />
              <Image size={18} aria-hidden="true" />
            </span>
            <button
              type="button"
              className={styles.primaryButton}
              disabled={!note.trim() || addNote.isPending}
              onClick={send}
            >
              Send
            </button>
          </div>
        </div>
        {addNote.isError ? (
          <p className={styles.errorText} role="alert">
            The note could not be sent. Please try again.
          </p>
        ) : null}
      </div>
    </Modal>
  );
}
