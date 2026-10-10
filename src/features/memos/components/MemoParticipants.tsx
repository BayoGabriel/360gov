import { PersonCell } from '../../../shared/components/PersonCell';
import type { Person } from '../types/memos.types';
import styles from './memos.module.css';

export function MemoParticipants({ participants }: { participants: Person[] }) {
  if (participants.length === 0) {
    return <p className={styles.status}>No participants.</p>;
  }
  return (
    <ul className={styles.participantList}>
      {participants.map((person) => (
        <li key={person.email || person.name} className={styles.participant}>
          <PersonCell
            name={person.name}
            email={person.email}
            avatarUrl={person.avatarUrl}
            online={person.online}
          />
        </li>
      ))}
    </ul>
  );
}
