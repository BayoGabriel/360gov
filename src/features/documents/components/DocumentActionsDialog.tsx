import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import {
  Archive,
  CheckCircle,
  Eye,
  FileClock,
  PenLine,
  RotateCcw,
  Send,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../../app/providers/auth-context';
import { DEFAULT_ROLE } from '../../../shared/auth/roles';
import type {
  DocumentAction,
  FileRecord,
  MenuAnchor,
} from '../types/documents.types';
import { documentActionsFor } from '../utils/workflow-actions';
import styles from '../documents.module.css';

const ACTION_ICONS: Record<DocumentAction, typeof Eye> = {
  view: Eye,
  trail: FileClock,
  note: PenLine,
  assign: UserPlus,
  forward: Send,
  revision: RotateCcw,
  approve: CheckCircle,
  archive: Archive,
};

interface DocumentActionsDialogProps {
  document: FileRecord;
  /** Viewport position of the button that opened this menu. */
  anchor: MenuAnchor;
  onAction: (action: DocumentAction, document: FileRecord) => void;
  onClose: () => void;
}

export function DocumentActionsDialog({
  document,
  anchor,
  onAction,
  onClose,
}: DocumentActionsDialogProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const { session } = useAuth();
  const role =
    session.status === 'authenticated'
      ? (session.user.role ?? DEFAULT_ROLE)
      : DEFAULT_ROLE;
  const actions = documentActionsFor(
    { role },
    { signatureRequired: document.signatureRequired },
  );

  // Place the menu beside the trigger button, clamped to the viewport.
  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const { width, height } = menu.getBoundingClientRect();
    let left = anchor.left - width - 8;
    if (left < 8) left = Math.max(8, anchor.right - width);
    let top = anchor.top - 4;
    if (top + height > window.innerHeight - 8) {
      top = window.innerHeight - height - 8;
    }
    setPos({ top: Math.max(8, top), left });
  }, [anchor]);

  // Close on outside click, Escape, scroll, or resize.
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.document.addEventListener('pointerdown', onPointerDown, true);
    window.document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onClose);
    window.addEventListener('scroll', onClose, true);
    return () => {
      window.document.removeEventListener('pointerdown', onPointerDown, true);
      window.document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onClose);
      window.removeEventListener('scroll', onClose, true);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={styles.optionsMenu}
      role="menu"
      aria-label={`Options for ${document.fileNo}`}
      style={{
        top: pos?.top ?? anchor.top,
        left: pos?.left ?? anchor.left,
        visibility: pos ? 'visible' : 'hidden',
      }}
    >
      <ul className={styles.optionsList} role="none">
        {actions.map(({ id, label }) => {
          const Icon = ACTION_ICONS[id];
          return (
          <li key={id} role="none">
            <button
              type="button"
              role="menuitem"
              className={styles.optionsItem}
              onClick={() => onAction(id, document)}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          </li>
          );
        })}
      </ul>
    </div>
  );
}
