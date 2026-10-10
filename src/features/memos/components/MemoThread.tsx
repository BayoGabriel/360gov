import { Fragment } from 'react';
import type { MemoMessage as MemoMessageModel } from '../types/memos.types';
import { formatDayLabel, messageDayKey } from '../utils/memo-formatters';
import { MemoMessage } from './MemoMessage';
import styles from './memos.module.css';

interface MemoThreadProps {
  messages: MemoMessageModel[] | undefined;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

export function MemoThread({ messages, loading, error, onRetry }: MemoThreadProps) {
  if (loading) {
    return (
      <p className={styles.status} role="status">
        Loading conversation…
      </p>
    );
  }
  if (error || !messages) {
    return (
      <div className={styles.status} role="alert">
        <p>The conversation could not be loaded.</p>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }
  if (messages.length === 0) {
    return <p className={styles.status}>No messages yet.</p>;
  }

  return (
    <ol className={styles.thread}>
      {messages.map((message, index) => {
        const previous = index > 0 ? messages[index - 1] : undefined;
        const showDivider =
          !previous ||
          messageDayKey(previous.sentAt) !== messageDayKey(message.sentAt);
        return (
          <Fragment key={message.id}>
            {showDivider && (
              <li className={styles.dayDivider} aria-hidden="true">
                <span>{formatDayLabel(message.sentAt)}</span>
              </li>
            )}
            <MemoMessage message={message} />
          </Fragment>
        );
      })}
    </ol>
  );
}
