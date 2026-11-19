import { useRef, useState } from 'react';
import { Forward, MoreHorizontal, Tag, Upload } from 'lucide-react';
import type {
  OutgoingFileAction,
  OutgoingFileItem,
} from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { AnchoredPopup, type PopupAnchor } from './AnchoredPopup';

interface RowActionsMenuProps {
  file: OutgoingFileItem;
  disabled: boolean;
  onAction: (action: OutgoingFileAction, fileName?: string) => void;
}

interface ActionItem {
  id: OutgoingFileAction;
  label: string;
  icon: typeof Upload;
  done: boolean;
}

/** Per-row hamburger menu holding the outgoing file actions. */
export function RowActionsMenu({
  file,
  disabled,
  onAction,
}: RowActionsMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [anchor, setAnchor] = useState<PopupAnchor | null>(null);

  const open = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setAnchor({
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
      });
    }
  };

  const items: ActionItem[] = [
    {
      id: 'upload',
      label: file.uploaded ? 'Uploaded' : 'Upload',
      icon: Upload,
      done: file.uploaded,
    },
    {
      id: 'forward',
      label: file.forwarded ? 'Forwarded' : 'Forward File',
      icon: Forward,
      done: file.forwarded,
    },
    {
      id: 'tag',
      label: file.tagged ? 'Tagged' : 'Tag',
      icon: Tag,
      done: file.tagged,
    },
  ];

  const pick = (item: ActionItem) => {
    setAnchor(null);
    if (item.id === 'upload') {
      fileInputRef.current?.click();
    } else {
      onAction(item.id);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className={styles.visuallyHidden}
        aria-label={`Choose file to upload for ${file.reference}`}
        onChange={(event) => {
          const chosen = event.target.files?.[0];
          if (chosen) onAction('upload', chosen.name);
          event.target.value = '';
        }}
      />
      <button
        ref={triggerRef}
        type="button"
        className={styles.rowMenuButton}
        aria-label={`Actions for ${file.reference}`}
        aria-haspopup="menu"
        aria-expanded={anchor !== null}
        disabled={disabled}
        onClick={open}
      >
        <MoreHorizontal size={18} aria-hidden="true" />
      </button>
      {anchor ? (
        <AnchoredPopup
          anchor={anchor}
          triggerRef={triggerRef}
          label={`Actions for ${file.reference}`}
          onClose={() => setAnchor(null)}
        >
          <ul className={styles.popupMenu} role="menu">
            {items.map((item) => (
              <li key={item.id} role="none">
                <button
                  type="button"
                  role="menuitem"
                  className={styles.popupMenuItem}
                  disabled={disabled || item.done}
                  onClick={() => pick(item)}
                >
                  <item.icon size={16} aria-hidden="true" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </AnchoredPopup>
      ) : null}
    </>
  );
}
