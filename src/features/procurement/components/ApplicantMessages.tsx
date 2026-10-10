import { Fragment } from 'react';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import type { ContractMessage } from '../types/procurement.types';
import {
  formatDayLabel,
  formatMessageTime,
  messageDayKey,
} from '../utils/procurement-formatters';
import styles from './procurement.module.css';

interface ApplicantMessagesProps {
  messages: ContractMessage[] | undefined;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

export function ApplicantMessages({
  messages,
  loading,
  error,
  onRetry,
}: ApplicantMessagesProps) {
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
    return (
      <p className={styles.status}>
        No messages yet — start the conversation below.
      </p>
    );
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
            <li
              className={`${styles.message} ${message.isOwn ? styles.messageOwn : ''}`}
            >
              {!message.isOwn && (
                <Avatar
                  name={message.author.name}
                  src={message.author.avatarUrl}
                  size={30}
                />
              )}
              <div className={styles.messageBody}>
                <div className={styles.messageMeta}>
                  <span className={styles.messageAuthor}>
                    {message.isOwn ? 'You' : message.author.name}
                  </span>
                  <span className={styles.messageTime}>
                    {formatMessageTime(message.sentAt)}
                  </span>
                </div>
                <p
                  className={`${styles.bubble} ${message.isOwn ? styles.bubbleOwn : ''}`}
                >
                  {message.body}
                </p>
              </div>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
