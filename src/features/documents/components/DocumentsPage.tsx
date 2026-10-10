import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ListToolbar } from '../../../shared/components/ListToolbar';
import { Pagination } from '../../../shared/components/Pagination';
import { ROUTES } from '../../../shared/constants/routes';
import { useDocumentFilterOptions } from '../queries/documents.queries';
import { useDocumentDialogs } from '../hooks/useDocumentDialogs';
import { useDocumentsPage, DOCUMENT_VIEWS } from '../hooks/useDocumentsPage';
import styles from '../documents.module.css';
import { DocumentDialogs } from './DocumentDialogs';
import { DocumentsTable } from './DocumentsTable';
import { FilterDialog } from './FilterDialog';
import { ViewTabs } from './ViewTabs';

export function DocumentsPage() {
  const page = useDocumentsPage();
  const dialogs = useDocumentDialogs();
  const filterOptions = useDocumentFilterOptions();
  const navigate = useNavigate();

  const activeView = DOCUMENT_VIEWS.find((v) => v.id === page.view);

  return (
    <div className={styles.page}>
      <ListToolbar
        query={page.query}
        from={page.from}
        to={page.to}
        onQueryChange={page.setQuery}
        onRangeChange={page.setRange}
        onFiltersClick={page.openFilters}
      />
      <ViewTabs view={page.view} onChange={page.setView} />
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h1 className={styles.panelTitle}>{activeView?.label}</h1>
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
            Loading documents…
          </p>
        ) : page.isError || !page.data ? (
          <div className={styles.status} role="alert">
            <p>The document list could not be loaded.</p>
            <button type="button" onClick={() => void page.refetch()}>
              Retry
            </button>
          </div>
        ) : page.data.items.length === 0 ? (
          <p className={styles.status}>No documents match the filters.</p>
        ) : (
          <>
            <DocumentsTable
              view={page.view}
              rows={page.data.items}
              selected={page.selected}
              onToggleRow={page.toggleRow}
              onToggleAll={page.toggleAll}
              onOpenOptions={dialogs.openOptions}
              onOpenDocument={(row) =>
                void navigate(`${ROUTES.documents}/${row.id}`)
              }
            />
            <Pagination
              page={page.data.page}
              totalPages={page.data.totalPages}
              onPageChange={page.setPage}
            />
          </>
        )}
      </section>
      {page.filtersOpen && (
        <FilterDialog
          open
          options={filterOptions.data}
          current={page.filters}
          onApply={(filters) => {
            page.setFilters(filters);
            page.closeFilters();
          }}
          onClose={page.closeFilters}
        />
      )}
      <DocumentDialogs
        dialog={dialogs.dialog}
        onAction={dialogs.onAction}
        onClose={dialogs.close}
      />
    </div>
  );
}
