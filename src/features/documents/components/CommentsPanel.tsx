import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../../shared/components/Toast';
import { useAddNote } from '../queries/documents.mutations';
import { useFileComments } from '../queries/documents.queries';
import styles from './documents.module.css';
import type { CommentSort } from './comments/comment-sort';
import { sortComments } from './comments/comment-sort';
import { CommentItem } from './comments/CommentItem';
import { CommentSortMenu } from './comments/CommentSortMenu';

interface CommentsPanelProps {
  fileId: string;
  onClose: () => void;
}

export function CommentsPanel({ fileId, onClose }: CommentsPanelProps) {
  const commentsQuery = useFileComments(fileId);
  const addNote = useAddNote(fileId);
  const toast = useToast();
  const [sort, setSort] = useState<CommentSort>('date-desc');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');

  const comments = sortComments(commentsQuery.data ?? [], sort).filter((c) =>
    `${c.author.name} ${c.text}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  const send = () => {
    if (!draft.trim()) return;
    addNote.mutate(draft.trim(), {
      onSuccess: () => {
        setDraft('');
        toast.success('Comment sent.');
      },
      onError: () => toast.error('The comment could not be sent.'),
    });
  };

  return (
    <aside className={styles.commentsPanel} aria-label="Comments">
      <header className={styles.commentsHeader}>
        <h2 className={styles.commentsTitle}>
          Comments{' '}
          <span className={styles.commentCount}>
            {commentsQuery.data?.length ?? 0}
          </span>
        </h2>
        <div className={styles.commentsHeaderActions}>
          <label className={styles.commentSearch}>
            <Search size={14} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search"
              aria-label="Search comments"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <CommentSortMenu value={sort} onChange={setSort} />
          <button
            type="button"
            className={styles.pdfIcon}
            aria-label="Close comments"
            onClick={onClose}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </header>
      {commentsQuery.isPending ? (
        <p className={styles.commentsEmpty}>Loading comments…</p>
      ) : (
        <ul className={styles.commentList}>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </ul>
      )}
      <div className={styles.commentComposer}>
        <textarea
          className={styles.noteArea}
          placeholder="Write a comment"
          aria-label="Write a comment"
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button
          type="button"
          className={styles.primaryButton}
          disabled={!draft.trim() || addNote.isPending}
          onClick={send}
        >
          Send
        </button>
      </div>
    </aside>
  );
}
