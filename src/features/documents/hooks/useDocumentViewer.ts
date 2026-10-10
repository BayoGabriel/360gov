import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ROUTES } from '../../../shared/constants/routes';
import {
  useApproveFile,
  useArchiveFile,
  useRequestRevision,
} from '../queries/documents.mutations';
import { useFile, useFileComments } from '../queries/documents.queries';

export type ViewerPanel = 'details' | 'comments' | 'closed';

export function useDocumentViewer() {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();
  const fileQuery = useFile(fileId);
  const commentsQuery = useFileComments(fileId);

  const [panel, setPanel] = useState<ViewerPanel>('details');
  const [approversOpen, setApproversOpen] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);

  const approve = useApproveFile();
  const revision = useRequestRevision();
  const archive = useArchiveFile();

  const closeViewer = () => navigate(ROUTES.documents);
  const doArchive = () => {
    if (!fileId) return;
    archive.mutate(fileId, { onSuccess: closeViewer });
  };

  return {
    fileId,
    fileQuery,
    commentsQuery,
    panel,
    approversOpen,
    forwardOpen,
    closeViewer,
    showComments: () => setPanel('comments'),
    showDetails: () => setPanel('details'),
    toggleDetails: () =>
      setPanel((p) => (p === 'details' ? 'closed' : 'details')),
    openApprovers: () => setApproversOpen(true),
    closeApprovers: () => setApproversOpen(false),
    openForward: () => setForwardOpen(true),
    closeForward: () => setForwardOpen(false),
    approve: () => fileId && approve.mutate(fileId),
    requestRevision: () => fileId && revision.mutate(fileId),
    archive: doArchive,
    busy: approve.isPending || revision.isPending || archive.isPending,
  };
}
