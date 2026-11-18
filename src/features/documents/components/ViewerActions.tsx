import type { ReactNode } from 'react';
import type { DocumentAction } from '../types/documents.types';
import type { DocumentActionSpec } from '../utils/workflow-actions';
import styles from './documents.module.css';

interface ViewerActionsProps {
  /** Role-filtered actions from the workflow rules. */
  actions: DocumentActionSpec[];
  busy: boolean;
  onAction: (action: DocumentAction) => void;
  /** Optional leading affordance rendered before the workflow buttons. */
  leadingAction?: ReactNode;
}

export function ViewerActions({
  actions,
  busy,
  onAction,
  leadingAction,
}: ViewerActionsProps) {
  return (
    <div className={styles.viewerActions}>
      {leadingAction}
      {actions.map((spec) => (
        <button
          key={spec.id}
          type="button"
          className={
            spec.id === 'approve'
              ? styles.primaryButton
              : styles.outlineButton
          }
          disabled={busy}
          onClick={() => onAction(spec.id)}
        >
          {spec.label}
        </button>
      ))}
    </div>
  );
}
