import { useEffect, useRef, useState } from 'react';
import {
  AlignJustify,
  CheckCircle,
  Eye,
  FileText,
  PenLine,
  Send,
} from 'lucide-react';
import type { UserAction } from '../types/users.types';
import styles from './users.module.css';

const ACTIONS: { id: UserAction; label: string; icon: typeof Eye }[] = [
  { id: 'deactivate', label: 'Deactivate', icon: Eye },
  { id: 'reset-password', label: 'Reset Password', icon: FileText },
  { id: 'assign-role', label: 'Assign Role', icon: PenLine },
  { id: 'forward', label: 'Forward', icon: Send },
  { id: 'approve', label: 'Approve', icon: CheckCircle },
];

interface UsersActionsMenuProps {
  rowLabel: string;
  onAction: (action: UserAction) => void;
}

export function UsersActionsMenu({
  rowLabel,
  onAction,
}: UsersActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.rowActions} ref={rootRef}>
      <button
        type="button"
        className={styles.menuButton}
        aria-label={`Actions for ${rowLabel}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <AlignJustify size={16} aria-hidden="true" />
      </button>
      {open && (
        <ul className={styles.rowMenu} role="menu">
          {ACTIONS.map(({ id, label, icon: Icon }) => (
            <li key={id} role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.rowMenuItem}
                onClick={() => {
                  setOpen(false);
                  onAction(id);
                }}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

