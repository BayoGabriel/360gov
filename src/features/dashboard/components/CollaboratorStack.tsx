import { Avatar } from '../../../shared/components/Avatar/Avatar';
import type { Collaborator } from '../types/dashboard.types';
import styles from '../dashboard.module.css';

const MAX_SHOWN = 3;

export function CollaboratorStack({
  collaborators,
}: {
  collaborators: Collaborator[];
}) {
  const shown = collaborators.slice(0, MAX_SHOWN);
  const extra = collaborators.length - shown.length;
  return (
    <span
      className={styles.collabStack}
      title={collaborators.map((c) => c.name).join(', ')}
    >
      {shown.map((c) => (
        <Avatar key={c.name} name={c.name} src={c.avatarUrl} size={24} />
      ))}
      {extra > 0 && <span className={styles.collabMore}>+{extra}</span>}
    </span>
  );
}
