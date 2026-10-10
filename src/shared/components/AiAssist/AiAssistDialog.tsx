import { useEffect } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useAiAssist } from '../../ai/useAiAssist';
import type { AiAssistRequest } from '../../ai/ai.types';
import { Modal } from '../Modal';
import styles from './AiAssist.module.css';

interface AiAssistDialogProps {
  request: AiAssistRequest;
  title: string;
  onApply?: (text: string) => void;
  onClose: () => void;
}

export function AiAssistDialog({
  request,
  title,
  onApply,
  onClose,
}: AiAssistDialogProps) {
  const ai = useAiAssist();

  useEffect(() => {
    ai.generate(request);
    // Generate once per open; regenerations go through ai.regenerate().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal open onClose={onClose} title={title}>
      <div className={styles.dialogBody}>
        <p className={styles.subject}>{request.subject}</p>
        <div className={styles.output} aria-live="polite">
          {ai.isPending ? (
            <span className={styles.thinking} role="status">
              <span className={styles.thinkingDot} aria-hidden="true" />
              Drafting — please review before using…
            </span>
          ) : ai.isError ? (
            <span className={styles.errorText} role="alert">
              The AI assistant could not respond.{' '}
              <button type="button" onClick={ai.retry}>
                Retry
              </button>
            </span>
          ) : (
            (ai.text ?? '')
          )}
        </div>
        <p className={styles.disclaimer}>
          AI operates within your access permissions and cannot approve, sign,
          or act on your behalf. Output is advisory — verify it before use.
          Requests are recorded in the audit trail.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.aiButton}
            disabled={ai.isPending}
            onClick={ai.regenerate}
          >
            <RefreshCw size={14} aria-hidden="true" />
            Regenerate
          </button>
          {onApply && ai.text ? (
            <button
              type="button"
              className={styles.aiButton}
              onClick={() => {
                onApply(ai.text ?? '');
                onClose();
              }}
            >
              <Sparkles size={14} aria-hidden="true" />
              Insert
            </button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
