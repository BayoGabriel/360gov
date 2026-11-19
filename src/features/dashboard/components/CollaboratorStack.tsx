import { useRef, useState } from 'react';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import type { Collaborator } from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { AnchoredPopup, type PopupAnchor } from './AnchoredPopup';

const MAX_SHOWN = 3;

/**
 * Overlapping avatars of everyone who has treated the document; clicking
 * opens a popover listing each person by name.
 */
export function CollaboratorStack({
  collaborators,
}: {
  collaborators: Collaborator[];
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [anchor, setAnchor] = useState<PopupAnchor | null>(null);
  const shown = collaborators.slice(0, MAX_SHOWN);
  const extra = collaborators.length - shown.length;

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

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.collabTrigger}
        aria-label={`View ${collaborators.length} people who treated this document`}
        aria-expanded={anchor !== null}
        onClick={open}
      >
        <span className={styles.collabStack}>
          {shown.map((c) => (
            <Avatar key={c.name} name={c.name} src={c.avatarUrl} size={24} />
          ))}
          {extra > 0 && <span className={styles.collabMore}>+{extra}</span>}
        </span>
      </button>
      {anchor ? (
        <AnchoredPopup
          anchor={anchor}
          triggerRef={triggerRef}
          label="People who treated this document"
          onClose={() => setAnchor(null)}
        >
          <p className={styles.popupTitle}>Treated by</p>
          <ul className={styles.peopleList}>
            {collaborators.map((c) => (
              <li key={c.name} className={styles.peopleItem}>
                <Avatar name={c.name} src={c.avatarUrl} size={28} />
                <span>{c.name}</span>
              </li>
            ))}
          </ul>
        </AnchoredPopup>
      ) : null}
    </>
  );
}
