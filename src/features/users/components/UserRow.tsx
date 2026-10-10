import { ChevronDown } from 'lucide-react';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { formatLongDate } from '../../../shared/lib/format-date';
import { USER_ROLES } from '../types/users.types';
import type {
  UserAction,
  UserRecord,
  UserRole,
} from '../types/users.types';
import { UsersActionsMenu } from './UsersActionsMenu';
import { UserStatusBadge } from './UserStatusBadge';
import styles from './users.module.css';

interface UserRowProps {
  user: UserRecord;
  checked: boolean;
  onToggle: (id: string) => void;
  onRoleChange: (userId: string, role: UserRole) => void;
  roleChangePending: boolean;
  onAction: (action: UserAction, user: UserRecord) => void;
}

export function UserRow({
  user,
  checked,
  onToggle,
  onRoleChange,
  roleChangePending,
  onAction,
}: UserRowProps) {
  return (
    <tr className={styles.row}>
      <td>
        <input
          type="checkbox"
          className={styles.checkbox}
          aria-label={`Select ${user.name}`}
          checked={checked}
          onChange={() => onToggle(user.id)}
        />
      </td>
      <td>
        <span className={styles.personCell}>
          <Avatar name={user.name} src={user.avatarUrl} size={32} />
          <span className={styles.personText}>
            <span className={styles.personName}>{user.name}</span>
            <span className={styles.personEmail}>{user.email}</span>
          </span>
        </span>
      </td>
      <td>
        <span className={styles.roleCell}>
          <select
            className={styles.roleSelect}
            aria-label={`Role for ${user.name}`}
            value={user.role}
            disabled={roleChangePending}
            onChange={(event) =>
              onRoleChange(user.id, event.target.value as UserRole)
            }
          >
            {USER_ROLES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className={styles.roleSelectIcon}
            aria-hidden="true"
          />
        </span>
      </td>
      <td>{user.department}</td>
      <td>
        <UserStatusBadge status={user.status} />
      </td>
      <td className={styles.dateCell}>{formatLongDate(user.lastLogin)}</td>
      <td>
        <UsersActionsMenu
          rowLabel={user.name}
          onAction={(action) => onAction(action, user)}
        />
      </td>
    </tr>
  );
}
