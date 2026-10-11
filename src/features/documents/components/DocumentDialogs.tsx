import type { ActiveDialog } from '../hooks/useDocumentDialogs';
import type { DocumentAction, FileRecord } from '../types/documents.types';
import { AddNoteDialog } from './AddNoteDialog';
import { AssignDialog } from './AssignDialog';
import { DocumentActionsDialog } from './DocumentActionsDialog';
import { DocumentTrailDialog } from './DocumentTrailDialog';
import { ForwardDialog } from './ForwardDialog';
import { RequestRevisionDialog } from './RequestRevisionDialog';
import { ViewFileDialog } from './ViewFileDialog';

interface DocumentDialogsProps {
  dialog: ActiveDialog;
  onAction: (action: DocumentAction, document: FileRecord) => void;
  onClose: () => void;
}

export function DocumentDialogs({
  dialog,
  onAction,
  onClose,
}: DocumentDialogsProps) {
  if (!dialog) return null;
  switch (dialog.kind) {
    case 'options':
      return (
        <DocumentActionsDialog
          document={dialog.document}
          anchor={dialog.anchor}
          onAction={onAction}
          onClose={onClose}
        />
      );
    case 'view':
      return <ViewFileDialog document={dialog.document} onClose={onClose} />;
    case 'trail':
      return (
        <DocumentTrailDialog document={dialog.document} onClose={onClose} />
      );
    case 'note':
      return <AddNoteDialog document={dialog.document} onClose={onClose} />;
    case 'assign':
      return <AssignDialog document={dialog.document} onClose={onClose} />;
    case 'forward':
      return <ForwardDialog document={dialog.document} onClose={onClose} />;
    case 'revision':
      return (
        <RequestRevisionDialog document={dialog.document} onClose={onClose} />
      );
  }
}
