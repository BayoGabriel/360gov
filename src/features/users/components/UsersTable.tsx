import type {
  UserAction,
  UserRecord,
  UserRole,
  UserSort,
} from '../types/users.types';
import { UserRow } from './UserRow';
import styles from './users.module.css';

interface UsersTableProps {
  users: UserRecord[];
  selected: ReadonlySet<string>;
  sort: UserSort;
  onToggleSort: () => void;
  onToggleRow: (id: string) => void;
  onToggleAll: (rows: UserRecord[]) => void;
  onRoleChange: (userId: string, role: UserRole) => void;
  roleChangePending: boolean;
  onRowAction: (action: UserAction, user: UserRecord) => void;
}

export function UsersTable({
  users,
  selected,
  sort,
  onToggleSort,
  onToggleRow,
  onToggleAll,
  onRoleChange,
  roleChangePending,
  onRowAction,
}: UsersTableProps) {
  const allSelected = users.length > 0 && selected.size === users.length;

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" className={styles.checkCol}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={allSelected}
                onChange={() => onToggleAll(users)}
                aria-label="Select all users on this page"
              />
            </th>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Department</th>
            <th scope="col">Status</th>
            <th scope="col">
              <button
                type="button"
                className={styles.sortButton}
                onClick={onToggleSort}
                aria-label={`Sort by last login, currently ${sort === 'desc' ? 'newest first' : 'oldest first'}`}
              >
                Last Log In {sort === 'desc' ? '↓' : '↑'}
              </button>
            </th>
            <th scope="col">
              <span className={styles.srOnly}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              checked={selected.has(user.id)}
              onToggle={onToggleRow}
              onRoleChange={onRoleChange}
              roleChangePending={roleChangePending}
              onAction={onRowAction}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
