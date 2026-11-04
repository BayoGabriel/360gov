import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { useWorkspaceAccount } from '../queries/workspace.queries';
import styles from './workspace.module.css';

export function AccountChip() {
  const { data } = useWorkspaceAccount();
  if (!data?.connected) return null;
  return (
    <div className={styles.account} title="Connected Google account">
      <Avatar name={data.name ?? ''} src={data.avatarUrl} size={32} />
      <span className={styles.accountMeta}>
        <span className={styles.accountLabel}>Connected</span>
        <span className={styles.accountEmail}>{data.email}</span>
      </span>
    </div>
  );
}
