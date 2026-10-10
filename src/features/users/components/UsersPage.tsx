import { MoreVertical } from 'lucide-react';
import { useUserDialogs } from '../hooks/useUserDialogs';
import { useUsersPage } from '../hooks/useUsersPage';
import { UserDialogs } from './UserDialogs';
import { UsersHeader } from './UsersHeader';
import { UsersPagination } from './UsersPagination';
import { UsersTable } from './UsersTable';
import { UsersToolbar } from './UsersToolbar';
import styles from './users.module.css';

export function UsersPage() {
  const page = useUsersPage();
  const { dialog, close, onAction, openAdd, openFilter } = useUserDialogs();

  return (
    <div className={styles.page}>
      <UsersHeader onAdd={openAdd} />
      <UsersToolbar
        query={page.query}
        onQueryChange={page.setQuery}
        from={page.from}
        to={page.to}
        onRangeChange={page.setRange}
        onOpenFilters={openFilter}
      />
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>All Users</h2>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="More options"
          >
            <MoreVertical size={18} aria-hidden="true" />
          </button>
        </div>
        {page.isPending ? (
          <p className={styles.status} role="status">
            Loading users…
          </p>
        ) : page.isError || !page.data ? (
          <div className={styles.status} role="alert">
            <p>The user list could not be loaded.</p>
            <button type="button" onClick={() => void page.refetch()}>
              Retry
            </button>
          </div>
        ) : page.data.items.length === 0 ? (
          <p className={styles.status}>No users match the filters.</p>
        ) : (
          <>
            <UsersTable
              users={page.data.items}
              selected={page.selected}
              sort={page.sort}
              onToggleSort={page.toggleSort}
              onToggleRow={page.toggleRow}
              onToggleAll={page.toggleAll}
              onRoleChange={page.onRoleChange}
              roleChangePending={page.roleChangePending}
              onRowAction={onAction}
            />
            <UsersPagination
              page={page.data.page}
              totalPages={page.data.totalPages}
              onPageChange={page.setPage}
            />
          </>
        )}
      </section>
      <UserDialogs
        dialog={dialog}
        filters={page.filters}
        onApplyFilters={(filters) => {
          page.setFilters(filters);
          close();
        }}
        onClose={close}
      />
    </div>
  );
}
