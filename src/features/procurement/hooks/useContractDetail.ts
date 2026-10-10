import { useState } from 'react';
import { useParams } from 'react-router';
import { useToast } from '../../../shared/components/Toast';
import { useContractAction } from '../queries/procurement.mutations';
import {
  useContract,
  useContractActivity,
  useContractBids,
} from '../queries/procurement.queries';
import type {
  Bid,
  ContractAction,
  ContractStatus,
} from '../types/procurement.types';

export type DetailTab = 'overview' | 'applicants' | 'documents' | 'activity';

const ACTION_TOASTS: Record<ContractAction, string> = {
  publish: 'Tender published to the public notice board.',
  'close-submissions': 'Submissions closed; evaluation has commenced.',
  complete: 'Contract marked as completed.',
  cancel: 'Tender cancelled.',
};

/** Lifecycle actions available per contract status. */
export function contractActionsFor(
  status: ContractStatus,
): { action: ContractAction; label: string; confirm: boolean }[] {
  switch (status) {
    case 'draft':
      return [{ action: 'publish', label: 'Publish Tender', confirm: true }];
    case 'open':
      return [
        {
          action: 'close-submissions',
          label: 'Close Submissions',
          confirm: true,
        },
        { action: 'cancel', label: 'Cancel Tender', confirm: true },
      ];
    case 'evaluation':
      return [{ action: 'cancel', label: 'Cancel Tender', confirm: true }];
    case 'awarded':
      return [
        { action: 'complete', label: 'Mark Completed', confirm: true },
        { action: 'cancel', label: 'Cancel Contract', confirm: true },
      ];
    default:
      return [];
  }
}

export function useContractDetail() {
  const { contractId } = useParams<{ contractId: string }>();
  const toast = useToast();
  const [tab, setTab] = useState<DetailTab>('overview');
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [awardBid, setAwardBid] = useState<Bid | null>(null);
  const [adjustBid, setAdjustBid] = useState<Bid | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<ContractAction | null>(
    null,
  );

  const contract = useContract(contractId);
  const bids = useContractBids(contractId);
  const activity = useContractActivity(contractId);
  const runAction = useContractAction(contractId ?? '');

  const selectedBid = (bids.data ?? []).find((b) => b.id === selectedBidId);

  const executeAction = (action: ContractAction) => {
    runAction.mutate(action, {
      onSuccess: () => {
        toast.success(ACTION_TOASTS[action]);
        setPendingAction(null);
      },
      onError: () =>
        toast.error('The contract could not be updated. Please try again.'),
    });
  };

  const requestAction = (action: ContractAction, confirm: boolean) => {
    if (confirm) setPendingAction(action);
    else executeAction(action);
  };

  return {
    contractId,
    contract,
    bids,
    activity,
    tab,
    setTab,
    selectedBid,
    openBid: (bid: Bid) => setSelectedBidId(bid.id),
    closeBid: () => setSelectedBidId(null),
    awardBid,
    setAwardBid,
    adjustBid,
    setAdjustBid,
    uploadOpen,
    openUpload: () => setUploadOpen(true),
    closeUpload: () => setUploadOpen(false),
    pendingAction,
    cancelAction: () => setPendingAction(null),
    requestAction,
    executeAction,
    actionPending: runAction.isPending,
  };
}
