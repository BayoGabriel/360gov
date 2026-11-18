import { useState } from 'react';
import { useAuth } from '../../../app/providers/auth-context';
import { DEFAULT_ROLE } from '../../../shared/auth/roles';
import { useToast } from '../../../shared/components/Toast';
import {
  useApproveFile,
  useArchiveFile,
} from '../queries/documents.mutations';
import type {
  DocumentAction,
  FileRecord,
  MenuAnchor,
} from '../types/documents.types';
import { approveSuccessMessage } from '../utils/workflow-actions';

export type ActiveDialog =
  | { kind: 'options'; document: FileRecord; anchor: MenuAnchor }
  | { kind: 'sign'; document: FileRecord }
  | {
      kind: Exclude<DocumentAction, 'approve' | 'archive'>;
      document: FileRecord;
    }
  | null;

export function useDocumentDialogs() {
  const [dialog, setDialog] = useState<ActiveDialog>(null);
  const approve = useApproveFile();
  const archive = useArchiveFile();
  const toast = useToast();
  const { session } = useAuth();
  const user =
    session.status === 'authenticated'
      ? { role: session.user.role ?? DEFAULT_ROLE }
      : undefined;

  const onAction = (action: DocumentAction, document: FileRecord) => {
    if (action === 'approve' && document.signatureRequired) {
      setDialog({ kind: 'sign', document });
    } else if (action === 'approve') {
      approve.mutate({ fileId: document.id }, {
        onSuccess: () =>
          toast.success(approveSuccessMessage(user, document.fileNo)),
        onError: () => toast.error('The file could not be approved.'),
      });
      setDialog(null);
    } else if (action === 'archive') {
      archive.mutate(document.id, {
        onSuccess: () =>
          toast.success(`${document.fileNo} archived successfully.`),
        onError: () => toast.error('The file could not be archived.'),
      });
      setDialog(null);
    } else {
      setDialog({ kind: action, document });
    }
  };
  const openOptions = (document: FileRecord, anchor: MenuAnchor) =>
    setDialog({ kind: 'options', document, anchor });
  const close = () => setDialog(null);

  return { dialog, onAction, openOptions, close };
}
