import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useToast } from '../../../shared/components/Toast';
import { ROUTES } from '../../../shared/constants/routes';
import {
  useApproveFile,
  useArchiveFile,
} from '../queries/documents.mutations';
import { useFile, useFileComments } from '../queries/documents.queries';

export type ViewerPanel = 'details' | 'comments' | 'closed';

export function useDocumentViewer() {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();
  const fileQuery = useFile(fileId);
  const commentsQuery = useFileComments(fileId);
  const toast = useToast();

  const [panel, setPanel] = useState<ViewerPanel>('details');
  const [approversOpen, setApproversOpen] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);

  const approve = useApproveFile();
  const archive = useArchiveFile();

  const closeViewer = () => navigate(ROUTES.documents);
  const doApprove = () => {
    if (!fileId) return;
    approve.mutate(fileId, {
      onSuccess: () =>
        toast.success(`${fileQuery.data?.fileNo ?? 'File'} approved.`),
      onError: () => toast.error('The file could not be approved.'),
    });
  };
  const doArchive = () => {
    if (!fileId) return;
    archive.mutate(fileId, {
      onSuccess: () => {
        toast.success(
          `${fileQuery.data?.fileNo ?? 'File'} archived successfully.`,
        );
        closeViewer();
      },
      onError: () => toast.error('The file could not be archived.'),
    });
  };

  return {
    fileId,
    fileQuery,
    commentsQuery,
    panel,
    approversOpen,
    forwardOpen,
    revisionOpen,
    closeViewer,
    showComments: () => setPanel('comments'),
    showDetails: () => setPanel('details'),
    toggleDetails: () =>
      setPanel((p) => (p === 'details' ? 'closed' : 'details')),
    openApprovers: () => setApproversOpen(true),
    closeApprovers: () => setApproversOpen(false),
    openForward: () => setForwardOpen(true),
    closeForward: () => setForwardOpen(false),
    assignOpen,
    openAssign: () => setAssignOpen(true),
    closeAssign: () => setAssignOpen(false),
    openRevision: () => setRevisionOpen(true),
    closeRevision: () => setRevisionOpen(false),
    approve: doApprove,
    archive: doArchive,
    busy: approve.isPending || archive.isPending,
  };
}
