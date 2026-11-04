import { useEffect, useState } from 'react';
import { ArrowLeft, Send, Star } from 'lucide-react';
import { AiAssist } from '../../../shared/components/AiAssist';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import {
  useMarkThreadRead,
  useSendMail,
  useToggleMailStar,
} from '../queries/workspace.mutations';
import { useMailThread } from '../queries/workspace.queries';
import styles from './workspace.module.css';

interface MailThreadViewProps {
  threadId: string;
  onBack: () => void;
}

export function MailThreadView({ threadId, onBack }: MailThreadViewProps) {
  const { data: thread, isPending, isError, refetch } = useMailThread(threadId);
  const sendMail = useSendMail();
  const toggleStar = useToggleMailStar();
  const markRead = useMarkThreadRead();
  const [reply, setReply] = useState('');

  useEffect(() => {
    if (thread?.unread) markRead.mutate(threadId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, thread?.unread]);

  const send = () => {
    const body = reply.trim();
    if (!body || !thread) return;
    sendMail.mutate(
      {
        threadId: thread.id,
        to: thread.from.email,
        subject: thread.subject,
        body,
      },
      { onSuccess: () => setReply('') },
    );
  };

  if (isPending) return <p className={styles.status}>Loading conversation…</p>;
  if (isError || !thread) {
    return (
      <div className={styles.status} role="alert">
        <p>The conversation could not be loaded.</p>
        <button type="button" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.threadHeader}>
        <button
          type="button"
          className={styles.outlineButton}
          onClick={onBack}
          aria-label="Back to inbox"
        >
          <ArrowLeft size={15} aria-hidden="true" />
        </button>
        <h2 className={styles.threadTitle}>{thread.subject}</h2>
        <button
          type="button"
          className={`${styles.starButton} ${thread.starred ? styles.starred : ''}`}
          aria-label={thread.starred ? 'Unstar thread' : 'Star thread'}
          aria-pressed={thread.starred}
          onClick={() => toggleStar.mutate(thread.id)}
        >
          <Star size={15} fill={thread.starred ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className={styles.messages}>
        {thread.messages.map((message) => {
          const mine = message.from.email.endsWith('@ministry.gov.ng');
          return (
            <article
              key={message.id}
              className={`${styles.message} ${mine ? styles.messageMine : ''}`}
            >
              <header className={styles.messageHead}>
                <span className={styles.messageFrom}>
                  {mine ? 'You' : message.from.name}
                </span>
                <span>{message.from.email}</span>
                <span>{formatListTimestamp(message.sentAt)}</span>
              </header>
              <p className={styles.messageBody}>{message.body}</p>
            </article>
          );
        })}
      </div>
      <div className={styles.composer}>
        <textarea
          placeholder={`Reply to ${thread.from.name}…`}
          aria-label="Reply"
          value={reply}
          onChange={(event) => setReply(event.target.value)}
        />
        <div className={styles.composerActions}>
          <span className={styles.composerAi}>
            <AiAssist
              task="reply"
              purpose="mail-reply"
              subject={thread.subject}
              context={`Latest message from ${thread.from.name}: ${thread.messages[thread.messages.length - 1]?.body ?? ''}`}
              variant="link"
              label="Draft with AI"
              onApply={setReply}
            />
          </span>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={!reply.trim() || sendMail.isPending}
            onClick={send}
          >
            <Send size={15} aria-hidden="true" />
            {sendMail.isPending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </>
  );
}
