import { useDocumentList } from '../../documents';
import { useContractList } from '../../procurement';
import type { CapabilitySource } from '../ai-capabilities';

export interface EntityOption {
  id: string;
  /** Picker label. */
  label: string;
  /** Subject passed to the AI request. */
  subject: string;
  /** Permission-scoped source material for the request. */
  context: string;
}

function useDocumentOptions(): { options: EntityOption[]; pending: boolean } {
  const pending = useDocumentList({ view: 'pending', page: 1 });
  const inReview = useDocumentList({ view: 'in-review', page: 1 });
  const items = [
    ...(pending.data?.items ?? []),
    ...(inReview.data?.items ?? []),
  ];
  return {
    pending: pending.isPending || inReview.isPending,
    options: items.map((file) => ({
      id: file.id,
      label: `${file.fileNo} — ${file.subject}`,
      subject: `${file.fileNo} — ${file.subject}`,
      context: `${file.description} Department: ${file.department}. Module: ${file.module}. Status: ${file.status}. ${file.completionPct}% complete.`,
    })),
  };
}

function useContractOptions(): { options: EntityOption[]; pending: boolean } {
  const list = useContractList({ view: 'all', page: 1 });
  return {
    pending: list.isPending,
    options: (list.data?.items ?? []).map((contract) => ({
      id: contract.id,
      label: `${contract.referenceNo} — ${contract.title}`,
      subject: `${contract.referenceNo} — ${contract.title}`,
      context: `${contract.description} Status: ${contract.status}. Bids received: ${contract.applicationCount}. Deadline: ${contract.submissionDeadline}.`,
    })),
  };
}

/** Options for the capability run dialog's record picker. */
export function useEntityOptions(source: CapabilitySource): {
  options: EntityOption[];
  pending: boolean;
} {
  const documents = useDocumentOptions();
  const contracts = useContractOptions();
  if (source.kind === 'document') return documents;
  if (source.kind === 'contract') return contracts;
  return { options: [], pending: false };
}
