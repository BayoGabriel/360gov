import { useState } from 'react';
import { useSendMemoMessage } from '../queries/memos.mutations';
import { useMemoDetail, useMemoMessages } from '../queries/memos.queries';

export type MemoPanelTab = 'messages' | 'participants';

/** Orchestration for the memo conversation side panel. */
export function useMemoPanel(memoId: string) {
  const [tab, setTab] = useState<MemoPanelTab>('messages');
  const [expanded, setExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [messageQuery, setMessageQuery] = useState('');

  const detail = useMemoDetail(memoId);
  const messages = useMemoMessages(memoId);
  const send = useSendMemoMessage(memoId);

  const q = messageQuery.trim().toLowerCase();
  const visibleMessages = messages.data?.filter(
    (message) =>
      !q ||
      message.body.toLowerCase().includes(q) ||
      message.author.name.toLowerCase().includes(q),
  );

  const sendMessage = (body: string, onSuccess?: () => void) => {
    const trimmed = body.trim();
    if (trimmed) send.mutate(trimmed, { onSuccess });
  };

  return {
    tab,
    setTab,
    expanded,
    toggleExpanded: () => setExpanded((v) => !v),
    searchOpen,
    toggleSearch: () => {
      setSearchOpen((v) => !v);
      setMessageQuery('');
    },
    messageQuery,
    setMessageQuery,
    detail,
    messages,
    visibleMessages,
    send,
    sendMessage,
  };
}
