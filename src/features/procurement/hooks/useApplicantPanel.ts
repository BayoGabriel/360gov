import { useState } from 'react';
import { useSendBidMessage } from '../queries/procurement.mutations';
import { useBidMessages } from '../queries/procurement.queries';

export type ApplicantTab = 'messages' | 'documents' | 'details';

/** Orchestration for the bidder conversation/document side panel. */
export function useApplicantPanel(contractId: string, bidId: string) {
  const [tab, setTab] = useState<ApplicantTab>('messages');
  const messages = useBidMessages(contractId, bidId);
  const send = useSendBidMessage(contractId, bidId);

  const sendMessage = (body: string, onSuccess?: () => void) => {
    const trimmed = body.trim();
    if (trimmed) send.mutate(trimmed, { onSuccess });
  };

  return { tab, setTab, messages, send, sendMessage };
}
