import { useState } from 'react';
import { Send } from 'lucide-react';
import styles from './memos.module.css';

interface MemoComposerProps {
  pending: boolean;
  error: boolean;
  onSend: (body: string, onSuccess: () => void) => void;
}

export function MemoComposer({ pending, error, onSend }: MemoComposerProps) {
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0 && !pending;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSend) return;
    onSend(text, () => setText(''));
  };

  return (
    <form className={styles.composerForm} onSubmit={submit}>
      <input
        type="text"
        className={styles.composerInput}
        placeholder="Message"
        aria-label="Message"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <button
        type="submit"
        className={styles.sendButton}
        aria-label="Send message"
        disabled={!canSend}
      >
        <Send size={16} aria-hidden="true" />
      </button>
      {error && (
        <p className={styles.errorText} role="alert">
          The message could not be sent. Please try again.
        </p>
      )}
    </form>
  );
}
