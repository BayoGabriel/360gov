import { useState } from 'react';
import { useToast } from '../../../shared/components/Toast';
import { useApproveFile } from '../queries/documents.mutations';
import type {
  DocumentAction,
  FileRecord,
  MenuAnchor,
} from '../types/documents.types';

export type ActiveDialog =
  | { kind: 'options'; document: FileRecord; anchor: MenuAnchor }
  | {
      kind: Exclude<DocumentAction, 'approve'>;
      document: FileRecord;
    }
  | null;

export function useDocumentDialogs() {
  const [dialog, setDialog] = useState<ActiveDialog>(null);
  const approve = useApproveFile();
  const toast = useToast();

  const onAction = (action: DocumentAction, document: FileRecord) => {
    if (action === 'approve') {
      approve.mutate(document.id, {
        onSuccess: () =>
          toast.success(`${document.fileNo} approved successfully.`),
        onError: () => toast.error('The file could not be approved.'),
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
