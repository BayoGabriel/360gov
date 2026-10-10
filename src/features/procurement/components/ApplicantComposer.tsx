import { useState } from 'react';
import { Send } from 'lucide-react';
import { AiAssist } from '../../../shared/components/AiAssist';
import styles from './procurement.module.css';

interface ApplicantComposerProps {
  pending: boolean;
  error: boolean;
  onSend: (body: string, onSuccess: () => void) => void;
  aiSubject: string;
  aiContext: string;
}

export function ApplicantComposer({
  pending,
  error,
  onSend,
  aiSubject,
  aiContext,
}: ApplicantComposerProps) {
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0 && !pending;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSend) return;
    onSend(text, () => setText(''));
  };

  return (
    <form className={styles.composerForm} onSubmit={submit}>
      <AiAssist
        task="reply"
        purpose="bid-reply"
        subject={aiSubject}
        context={aiContext}
        variant="icon"
        label="Draft a reply with AI"
        onApply={setText}
      />
      <input
        type="text"
        className={styles.composerInput}
        placeholder="Message the vendor"
        aria-label="Message the vendor"
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
