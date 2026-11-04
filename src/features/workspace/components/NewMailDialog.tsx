import { useState } from 'react';
import { Send } from 'lucide-react';
import { AiAssist } from '../../../shared/components/AiAssist';
import { Modal } from '../../../shared/components/Modal';
import { useSendMail } from '../queries/workspace.mutations';
import styles from './workspace.module.css';

interface NewMailDialogProps {
  onClose: () => void;
}

export function NewMailDialog({ onClose }: NewMailDialogProps) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const sendMail = useSendMail();

  const canSend = Boolean(to.trim() && subject.trim() && body.trim());

  const submit = () => {
    if (!canSend) return;
    sendMail.mutate(
      { to: to.trim(), subject: subject.trim(), body: body.trim() },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal open onClose={onClose} title="New message">
      <div className={styles.dialogBody}>
        <input
          className={styles.input}
          type="email"
          placeholder="To — e.g. officer@ministry.gov.ng"
          aria-label="Recipient"
          autoFocus
          value={to}
          onChange={(event) => setTo(event.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Subject"
          aria-label="Subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        />
        <textarea
          className={styles.textarea}
          placeholder="Write your message…"
          aria-label="Message"
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
        <div className={styles.actions}>
          <span className={styles.composerAi}>
            <AiAssist
              task="draft"
              purpose="mail-compose"
              subject={subject || 'New message'}
              context={to.trim() ? `Recipient: ${to.trim()}` : undefined}
              variant="link"
              label="Draft with AI"
              onApply={setBody}
            />
          </span>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={!canSend || sendMail.isPending}
            onClick={submit}
          >
            <Send size={15} aria-hidden="true" />
            {sendMail.isPending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
