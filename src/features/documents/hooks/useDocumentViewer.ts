import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../../app/providers/auth-context';
import { DEFAULT_ROLE } from '../../../shared/auth/roles';
import { useToast } from '../../../shared/components/Toast';
import { ROUTES } from '../../../shared/constants/routes';
import {
  useApproveFile,
  useArchiveFile,
} from '../queries/documents.mutations';
import { useFile, useFileComments } from '../queries/documents.queries';
import type { DocumentAction } from '../types/documents.types';
import {
  approveSuccessMessage,
  documentActionsFor,
} from '../utils/workflow-actions';

export type ViewerPanel = 'details' | 'comments' | 'closed';

/** Actions rendered as viewer buttons (the rest live in dialogs/panels). */
const VIEWER_ACTION_IDS: DocumentAction[] = [
  'assign',
  'forward',
  'revision',
  'approve',
  'archive',
];

export function useDocumentViewer() {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();
  const fileQuery = useFile(fileId);
  const commentsQuery = useFileComments(fileId);
  const toast = useToast();
  const { session } = useAuth();
  const user =
    session.status === 'authenticated'
      ? { role: session.user.role ?? DEFAULT_ROLE }
      : undefined;

  const [panel, setPanel] = useState<ViewerPanel>('details');
  const [approversOpen, setApproversOpen] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [signOpen, setSignOpen] = useState(false);

  const approve = useApproveFile();
  const archive = useArchiveFile();

  const closeViewer = () => navigate(ROUTES.documents);
  const doApprove = () => {
    if (!fileId) return;
    approve.mutate({ fileId }, {
      onSuccess: () =>
        toast.success(
          approveSuccessMessage(
            user,
            fileQuery.data?.fileNo ?? 'File',
          ),
        ),
      onError: () =>
        toast.error('The file could not be submitted for approval.'),
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

  const onAction = (action: DocumentAction) => {
    switch (action) {
      case 'approve':
        if (fileQuery.data?.signatureRequired) setSignOpen(true);
        else doApprove();
        break;
      case 'archive':
        doArchive();
        break;
      case 'forward':
        setForwardOpen(true);
        break;
      case 'assign':
        setAssignOpen(true);
        break;
      case 'revision':
        setRevisionOpen(true);
        break;
      default:
        break;
    }
  };

  const actions = documentActionsFor(user, {
    signatureRequired: fileQuery.data?.signatureRequired,
  }).filter((spec) => VIEWER_ACTION_IDS.includes(spec.id));

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
    closeForward: () => setForwardOpen(false),
    assignOpen,
    closeAssign: () => setAssignOpen(false),
    closeRevision: () => setRevisionOpen(false),
    signOpen,
    closeSign: () => setSignOpen(false),
    actions,
    onAction,
    busy: approve.isPending || archive.isPending,
  };
}
