import { useState } from 'react';
import { useApproveFile } from '../queries/documents.mutations';
import type { DocumentAction, FileRecord } from '../types/documents.types';

export type ActiveDialog =
  | { kind: 'options'; document: FileRecord }
  | {
      kind: Exclude<DocumentAction, 'approve'>;
      document: FileRecord;
    }
  | null;

export function useDocumentDialogs() {
  const [dialog, setDialog] = useState<ActiveDialog>(null);
  const approve = useApproveFile();

  const onAction = (action: DocumentAction, document: FileRecord) => {
    if (action === 'approve') {
      approve.mutate(document.id);
      setDialog(null);
    } else {
      setDialog({ kind: action, document });
    }
  };
  const openOptions = (document: FileRecord) =>
    setDialog({ kind: 'options', document });
  const close = () => setDialog(null);

  return { dialog, onAction, openOptions, close };
}
