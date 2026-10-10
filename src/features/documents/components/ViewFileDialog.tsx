import { FileText, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Modal } from '../../../shared/components/Modal';
import { ROUTES } from '../../../shared/constants/routes';
import { useFileComments } from '../queries/documents.queries';
import type { FileRecord } from '../types/documents.types';
import type { CommentSort } from './comments/comment-sort';
import { sortComments } from './comments/comment-sort';
import { CommentItem } from './comments/CommentItem';
import { CommentSortMenu } from './comments/CommentSortMenu';
import { FileDetailsSidebar } from './FileDetailsSidebar';
import { FilePreviewOverlay } from './viewer/FilePreviewOverlay';
import styles from './documents.module.css';

interface ViewFileDialogProps {
  document: FileRecord;
  onClose: () => void;
}

export function ViewFileDialog({ document, onClose }: ViewFileDialogProps) {
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sort, setSort] = useState<CommentSort>('date-desc');
  const commentsQuery = useFileComments(document.id);
  const comments = sortComments(commentsQuery.data ?? [], sort);

  const expand = () => {
    onClose();
    void navigate(`${ROUTES.documents}/${document.id}`);
  };

  if (previewOpen) {
    return (
      <FilePreviewOverlay
        file={document}
        onClose={() => setPreviewOpen(false)}
      />
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="File Details"
      className={styles.fileDetailsDialog}
      hideHeader
    >
        <div className={styles.fileDetails}>
          <FileDetailsSidebar
            document={document}
            onPreview={() => setPreviewOpen(true)}
            onExpand={expand}
          />
          <div className={styles.fileDetailsMain}>
            <header className={styles.fileMainHeader}>
              <div>
                <h3 className={styles.fileMainTitle}>{document.module}</h3>
                <p className={styles.fileMainName}>{document.fileName}</p>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                aria-label="Close"
                onClick={onClose}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>
            <div className={styles.fileIntro}>
              <span className={styles.pdfBadge} aria-hidden="true">
                <FileText size={20} />
              </span>
              <div>
                <h4 className={styles.fileIntroTitle}>{document.subject}</h4>
                <p className={styles.fileDescription}>{document.description}</p>
              </div>
            </div>
            <section aria-label="Comments">
              <header className={styles.commentsHead}>
                <h4 className={styles.commentsTitle}>
                  Comments {commentsQuery.data?.length ?? 0}
                </h4>
                <CommentSortMenu value={sort} onChange={setSort} />
              </header>
              {comments.length === 0 ? (
                <p className={styles.commentsEmpty}>No comments yet.</p>
              ) : (
                <ul className={styles.commentList}>
                  {comments.slice(0, 5).map((c) => (
                    <CommentItem key={c.id} comment={c} />
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </Modal>
  );
}
