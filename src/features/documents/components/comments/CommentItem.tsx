import { Eye, MoreVertical } from 'lucide-react';
import { Avatar } from '../../../../shared/components/Avatar/Avatar';
import { formatCommentDate } from '../../../../shared/lib/format-date';
import type { FileComment } from '../../types/documents.types';
import styles from '../documents.module.css';

export function CommentItem({ comment }: { comment: FileComment }) {
  return (
    <li className={styles.commentItem}>
      <div className={styles.commentMeta}>
        <span className={styles.commentDate}>
          {formatCommentDate(comment.createdAt)}
        </span>
        {comment.edited ? (
          <span className={styles.commentEdited}>Edited</span>
        ) : null}
      </div>
      <div className={styles.commentBody}>
        <Avatar name={comment.author.name} size={36} />
        <div className={styles.commentText}>
          <p className={styles.personName}>{comment.author.name}</p>
          <p className={styles.commentContent}>{comment.text}</p>
        </div>
        <div className={styles.commentActions}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label={`Comment options by ${comment.author.name}`}
          >
            <MoreVertical size={16} aria-hidden="true" />
          </button>
          <span className={styles.commentViews}>
            <Eye size={14} aria-hidden="true" /> {comment.views}
          </span>
        </div>
      </div>
    </li>
  );
}
