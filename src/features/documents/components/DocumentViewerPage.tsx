import { AiAssist } from '../../../shared/components/AiAssist';
import { useDocumentViewer } from '../hooks/useDocumentViewer';
import { ApproversDialog } from './ApproversDialog';
import { CommentsPanel } from './CommentsPanel';
import styles from '../documents.module.css';
import { ForwardDialog } from './ForwardDialog';
import { RequestRevisionDialog } from './RequestRevisionDialog';
import { ViewerActions } from './ViewerActions';
import { ViewerDetailsPanel } from './ViewerDetailsPanel';
import { PdfViewer } from './viewer/PdfViewer';

export function DocumentViewerPage() {
  const viewer = useDocumentViewer();
  const file = viewer.fileQuery.data;

  if (viewer.fileQuery.isPending) {
    return <p className={styles.status} role="status">Loading file…</p>;
  }
  if (viewer.fileQuery.isError || !file) {
    return (
      <div className={styles.status} role="alert">
        <p>The file could not be loaded.</p>
        <button type="button" onClick={() => void viewer.fileQuery.refetch()}>
          Retry
        </button>
      </div>
    );
  }

  const commenters = (viewer.commentsQuery.data ?? []).map((c) => c.author);

  return (
    <div className={styles.viewerPage}>
      <PdfViewer
        file={file}
        onClose={viewer.closeViewer}
        actionBar={
          <ViewerActions
            busy={viewer.busy}
            onApprove={viewer.approve}
            onRequestRevision={viewer.openRevision}
            onForward={viewer.openForward}
            onArchive={viewer.archive}
            leadingAction={
              <AiAssist
                task="summarize"
                purpose="document-summary"
                subject={`${file.fileNo} — ${file.subject}`}
                context={`${file.description} Department: ${file.department}. Module: ${file.module}. Status: ${file.status}. ${file.completionPct}% complete.`}
              />
            }
          />
        }
      />
      {viewer.panel === 'details' ? (
        <ViewerDetailsPanel
          document={file}
          commentsCount={viewer.commentsQuery.data?.length ?? 0}
          commenters={commenters}
          onShowApprovers={viewer.openApprovers}
          onShowComments={viewer.showComments}
          onCollapse={viewer.toggleDetails}
        />
      ) : viewer.panel === 'comments' ? (
        <CommentsPanel fileId={file.id} onClose={viewer.showDetails} />
      ) : (
        <button
          type="button"
          className={styles.expandHandle}
          onClick={viewer.toggleDetails}
        >
          Expand Details
        </button>
      )}
      {viewer.approversOpen ? (
        <ApproversDialog document={file} onClose={viewer.closeApprovers} />
      ) : null}
      {viewer.forwardOpen ? (
        <ForwardDialog document={file} onClose={viewer.closeForward} />
      ) : null}
      {viewer.revisionOpen ? (
        <RequestRevisionDialog
          document={file}
          onClose={viewer.closeRevision}
        />
      ) : null}
    </div>
  );
}
