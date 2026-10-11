import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import {
  CheckCircle,
  Eye,
  FileClock,
  PenLine,
  RotateCcw,
  Send,
  UserPlus,
} from 'lucide-react';
import type {
  DocumentAction,
  FileRecord,
  MenuAnchor,
} from '../types/documents.types';
import styles from '../documents.module.css';

const DOCUMENT_ACTIONS: {
  id: DocumentAction;
  label: string;
  icon: typeof Eye;
}[] = [
  { id: 'view', label: 'View File', icon: Eye },
  { id: 'trail', label: 'Approval Trail', icon: FileClock },
  { id: 'note', label: 'Add Note', icon: PenLine },
  { id: 'assign', label: 'Assign', icon: UserPlus },
  { id: 'forward', label: 'Forward', icon: Send },
  { id: 'revision', label: 'Request Revision', icon: RotateCcw },
  { id: 'approve', label: 'Approve', icon: CheckCircle },
];

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
        {DOCUMENT_ACTIONS.map(({ id, label, icon: Icon }) => (
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
        ))}
      </ul>
    </div>
  );
}
