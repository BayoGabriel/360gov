import { Avatar } from '../../../shared/components/Avatar/Avatar';
import type { MemoMessage as MemoMessageModel } from '../types/memos.types';
import { formatMemoTime } from '../utils/memo-formatters';
import styles from './memos.module.css';

export function MemoMessage({ message }: { message: MemoMessageModel }) {
  const own = message.isOwn;
  return (
    <li className={`${styles.message} ${own ? styles.messageOwn : ''}`}>
      {!own && (
        <span className={styles.avatarWrap}>
          <Avatar name={message.author.name} src={message.author.avatarUrl} size={32} />
          {message.author.online ? (
            <span className={styles.presenceDot} aria-hidden="true" />
          ) : null}
        </span>
      )}
      <div className={styles.messageBody}>
        <span className={styles.messageMeta}>
          <span className={styles.messageAuthor}>
            {own ? 'You' : message.author.name}
          </span>
          <time className={styles.messageTime} dateTime={message.sentAt}>
            {formatMemoTime(message.sentAt)}
          </time>
        </span>
        <p className={`${styles.bubble} ${own ? styles.bubbleOwn : ''}`}>
          {message.body}
        </p>
      </div>
    </li>
  );
}
