import { Plus } from 'lucide-react';
import styles from './users.module.css';

interface UsersHeaderProps {
  onAdd: () => void;
}

export function UsersHeader({ onAdd }: UsersHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>User Management</h1>
      <button type="button" className={styles.createButton} onClick={onAdd}>
        <Plus size={16} aria-hidden="true" />
        Add User
      </button>
    </header>
  );
}
