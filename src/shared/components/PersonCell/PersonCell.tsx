import { Avatar } from '../Avatar/Avatar';
import styles from './PersonCell.module.css';

interface PersonCellProps {
  name: string;
  email?: string;
  avatarUrl?: string;
  size?: number;
  /** Renders a presence indicator on the avatar. */
  online?: boolean;
}

export function PersonCell({
  name,
  email,
  avatarUrl,
  size = 32,
  online,
}: PersonCellProps) {
  return (
    <span className={styles.personCell}>
      <span className={styles.avatarWrap}>
        <Avatar name={name} src={avatarUrl} size={size} />
        {online ? (
          <span className={styles.presenceDot} aria-hidden="true" />
        ) : null}
      </span>
      <span className={styles.personText}>
        <span className={styles.personName}>{name}</span>
        {email ? <span className={styles.personEmail}>{email}</span> : null}
      </span>
    </span>
  );
}
