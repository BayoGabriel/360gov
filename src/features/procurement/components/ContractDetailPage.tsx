import { useContractDetail } from '../hooks/useContractDetail';
import { ActivityTab } from './ActivityTab';
import { AdjustmentDialog } from './AdjustmentDialog';
import { ApplicantPanel } from './ApplicantPanel';
import { ApplicantsTab } from './ApplicantsTab';
import { AwardDialog } from './AwardDialog';
import { ConfirmActionDialog } from './ConfirmActionDialog';
import { ContractDetailHeader } from './ContractDetailHeader';
import { ContractDetailTabs } from './ContractDetailTabs';
import { ContractOverviewTab } from './ContractOverviewTab';
import { ContractSummaryCards } from './ContractSummaryCards';
import { DocumentsTab } from './DocumentsTab';
import { UploadDocumentDialog } from './UploadDocumentDialog';
import styles from './procurement.module.css';

export function ContractDetailPage() {
  const page = useContractDetail();
  const contract = page.contract.data;

  if (page.contract.isPending) {
    return (
      <p className={styles.status} role="status">
        Loading contract…
      </p>
    );
  }
  if (page.contract.isError || !contract) {
    return (
      <div className={styles.status} role="alert">
        <p>The contract could not be loaded.</p>
        <button type="button" onClick={() => void page.contract.refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ContractDetailHeader
        contract={contract}
        actionPending={page.actionPending}
        onRequestAction={page.requestAction}
      />
      <ContractSummaryCards contract={contract} />
      <div className={styles.contentRow}>
        <section className={styles.panel}>
          <ContractDetailTabs
            tab={page.tab}
            applicantCount={contract.applicationCount}
            documentCount={contract.documents.length}
            onChange={page.setTab}
          />
          {page.tab === 'overview' ? (
            <ContractOverviewTab contract={contract} />
          ) : page.tab === 'applicants' ? (
            <ApplicantsTab
              bids={page.bids.data}
              loading={page.bids.isPending}
              error={page.bids.isError}
              currency={contract.currency}
              onRetry={() => void page.bids.refetch()}
              onOpenBid={page.openBid}
            />
          ) : page.tab === 'documents' ? (
            <DocumentsTab
              contract={contract}
              onUploadClick={page.openUpload}
            />
          ) : (
            <div className={styles.tabBody}>
              <ActivityTab
                entries={page.activity.data}
                loading={page.activity.isPending}
                error={page.activity.isError}
                onRetry={() => void page.activity.refetch()}
              />
            </div>
          )}
        </section>
        {page.selectedBid && page.contractId ? (
          <ApplicantPanel
            key={page.selectedBid.id}
            contractId={page.contractId}
            contractStatus={contract.status}
            currency={contract.currency}
            bid={page.selectedBid}
            onRequestAdjustment={page.setAdjustBid}
            onAward={page.setAwardBid}
            onClose={page.closeBid}
          />
        ) : null}
      </div>
      {page.awardBid ? (
        <AwardDialog
          contract={contract}
          bid={page.awardBid}
          onClose={() => page.setAwardBid(null)}
        />
      ) : null}
      {page.adjustBid && page.contractId ? (
        <AdjustmentDialog
          contractId={page.contractId}
          bid={page.adjustBid}
          onClose={() => page.setAdjustBid(null)}
        />
      ) : null}
      {page.uploadOpen && page.contractId ? (
        <UploadDocumentDialog
          contractId={page.contractId}
          onClose={page.closeUpload}
        />
      ) : null}
      {page.pendingAction ? (
        <ConfirmActionDialog
          action={page.pendingAction}
          pending={page.actionPending}
          onConfirm={() => page.executeAction(page.pendingAction ?? 'cancel')}
          onClose={page.cancelAction}
        />
      ) : null}
    </div>
  );
}
