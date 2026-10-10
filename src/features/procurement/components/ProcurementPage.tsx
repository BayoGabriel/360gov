import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ListToolbar } from '../../../shared/components/ListToolbar';
import { Pagination } from '../../../shared/components/Pagination';
import { ROUTES } from '../../../shared/constants/routes';
import { useContractFilterOptions } from '../queries/procurement.queries';
import { useProcurementPage } from '../hooks/useProcurementPage';
import { ContractFilterDialog } from './ContractFilterDialog';
import { ContractFormDialog } from './ContractFormDialog';
import { ContractsTable } from './ContractsTable';
import { ContractViewTabs } from './ContractViewTabs';
import styles from './procurement.module.css';

export function ProcurementPage() {
  const page = useProcurementPage();
  const filterOptions = useContractFilterOptions();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <ListToolbar
        query={page.query}
        from={page.from}
        to={page.to}
        searchPlaceholder="Search contracts or reference no"
        onQueryChange={page.setQuery}
        onRangeChange={page.setRange}
        onFiltersClick={page.openFilters}
      />
      <ContractViewTabs view={page.view} onChange={page.setView} />
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h1 className={styles.panelTitle}>Contracts &amp; Tenders</h1>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={page.openCreate}
          >
            <Plus size={16} aria-hidden="true" />
            New Contract
          </button>
        </div>
        {page.isPending ? (
          <p className={styles.status} role="status">
            Loading contracts…
          </p>
        ) : page.isError || !page.data ? (
          <div className={styles.status} role="alert">
            <p>The contract list could not be loaded.</p>
            <button type="button" onClick={() => void page.refetch()}>
              Retry
            </button>
          </div>
        ) : page.data.items.length === 0 ? (
          <p className={styles.status}>No contracts match the filters.</p>
        ) : (
          <>
            <ContractsTable
              rows={page.data.items}
              onOpenContract={(contract) =>
                void navigate(`${ROUTES.procurement}/${contract.id}`)
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
        <ContractFilterDialog
          view={page.view}
          options={filterOptions.data}
          current={page.filters}
          onApply={(filters) => {
            page.setFilters(filters);
            page.closeFilters();
          }}
          onClose={page.closeFilters}
        />
      )}
      {page.createOpen && <ContractFormDialog onClose={page.closeCreate} />}
    </div>
  );
}
