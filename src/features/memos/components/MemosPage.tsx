import { Plus } from 'lucide-react';
import { TaskFormDialog } from '../../tasks';
import { ListToolbar } from '../../../shared/components/ListToolbar';
import { Pagination } from '../../../shared/components/Pagination';
import { useMemosPage } from '../hooks/useMemosPage';
import { MemoDetailPanel } from './MemoDetailPanel';
import { MemoFilterDialog } from './MemoFilterDialog';
import { MemosTable } from './MemosTable';
import styles from './memos.module.css';

export function MemosPage() {
  const page = useMemosPage();
  const { list } = page;

  return (
    <div className={styles.page}>
      <ListToolbar
        query={page.searchInput}
        from={page.from}
        to={page.to}
        searchPlaceholder="Search for documents"
        onQueryChange={page.setSearchInput}
        onRangeChange={page.setDateRange}
        onFiltersClick={page.openFilters}
      />
      <div className={styles.contentRow}>
        <section className={styles.panel} aria-labelledby="memos-title">
          <div className={styles.panelHeader}>
            <h1 id="memos-title" className={styles.panelTitle}>
              Conversations
            </h1>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={page.openCreateTask}
            >
              <Plus size={16} aria-hidden="true" />
              Create New Task
            </button>
          </div>
          {list.isPending ? (
            <p className={styles.status} role="status">
              Loading conversations…
            </p>
          ) : list.isError || !list.data ? (
            <div className={styles.status} role="alert">
              <p>Conversations could not be loaded.</p>
              <button type="button" onClick={() => void list.refetch()}>
                Retry
              </button>
            </div>
          ) : list.data.items.length === 0 ? (
            <p className={styles.status}>No conversations match the filters.</p>
          ) : (
            <>
              <MemosTable
                rows={list.data.items}
                selected={page.selected}
                sort={page.sort}
                openMemoId={page.selectedMemoId}
                onToggleRow={page.toggleRow}
                onToggleAll={page.toggleAll}
                onToggleSort={page.toggleSort}
                onOpen={page.openMemo}
              />
              <Pagination
                page={list.data.page}
                totalPages={list.data.totalPages}
                onPageChange={page.setPage}
              />
            </>
          )}
        </section>
        {page.selectedMemoId && (
          <MemoDetailPanel
            key={page.selectedMemoId}
            memoId={page.selectedMemoId}
            total={list.data?.total ?? 0}
            onClose={page.closeMemo}
          />
        )}
      </div>
      {page.filtersOpen && (
        <MemoFilterDialog
          current={page.filters}
          onApply={(filters) => {
            page.applyFilters(filters);
            page.closeFilters();
          }}
          onClose={page.closeFilters}
        />
      )}
      {page.createTaskOpen && (
        <TaskFormDialog task={null} onClose={page.closeCreateTask} />
      )}
    </div>
  );
}
