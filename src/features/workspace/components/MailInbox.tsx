import { Inbox, MailPlus } from 'lucide-react';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import { useMailThreads } from '../queries/workspace.queries';
import { MailThreadView } from './MailThreadView';
import styles from './workspace.module.css';

interface MailInboxProps {
  threadId: string | null;
  onOpenThread: (threadId: string) => void;
  onCloseThread: () => void;
  onCompose: () => void;
}

export function MailInbox({
  threadId,
  onOpenThread,
  onCloseThread,
  onCompose,
}: MailInboxProps) {
  const { data: threads, isPending, isError, refetch } = useMailThreads();

  return (
    <div className={styles.mailLayout}>
      <section className={styles.mailList} aria-label="Inbox">
        <div className={styles.mailListHeader}>
          <h2 className={styles.panelTitle}>
            <Inbox size={16} aria-hidden="true" /> Inbox
          </h2>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={onCompose}
          >
            <MailPlus size={15} aria-hidden="true" />
            Compose
          </button>
        </div>
        {isPending ? (
          <p className={styles.status}>Loading mail…</p>
        ) : isError ? (
          <div className={styles.status} role="alert">
            <p>Mail could not be loaded.</p>
            <button type="button" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        ) : !threads?.length ? (
          <p className={styles.status}>No mail yet.</p>
        ) : (
          <ul className={styles.threadList}>
            {threads.map((thread) => (
              <li key={thread.id}>
                <button
                  type="button"
                  className={`${styles.threadItem} ${thread.id === threadId ? styles.threadItemActive : ''}`}
                  onClick={() => onOpenThread(thread.id)}
                  aria-current={thread.id === threadId}
                >
                  <span className={styles.threadTop}>
                    {thread.unread ? (
                      <span className={styles.unreadDot} aria-label="Unread" />
                    ) : null}
                    <span
                      className={`${styles.threadFrom} ${thread.unread ? styles.threadFromUnread : ''}`}
                    >
                      {thread.from.name}
                    </span>
                    <span className={styles.threadTime}>
                      {formatListTimestamp(thread.updatedAt)}
                    </span>
                  </span>
                  <span className={styles.threadSubject}>{thread.subject}</span>
                  <span className={styles.threadSnippet}>{thread.snippet}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className={styles.threadPanel} aria-label="Conversation">
        {threadId ? (
          <MailThreadView threadId={threadId} onBack={onCloseThread} />
        ) : (
          <div className={styles.emptyThread}>
            <Inbox size={36} aria-hidden="true" />
            <p>Select a conversation to read, or compose a new message.</p>
          </div>
        )}
      </section>
    </div>
  );
}
