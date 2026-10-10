import { useState } from 'react';
import { Check, Copy, RefreshCw } from 'lucide-react';
import type { useAiAssist } from '../../../shared/ai/useAiAssist';
import styles from './ai-hub.module.css';

type AiState = ReturnType<typeof useAiAssist>;

/** Shared rendering of an AI run: thinking state, output text, copy/regenerate. */
export function AiOutput({ ai }: { ai: AiState }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!ai.text) return;
    void navigator.clipboard?.writeText(ai.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  if (!ai.isPending && !ai.isError && !ai.text) return null;

  return (
    <>
      <div className={styles.output} aria-live="polite">
        {ai.isPending ? (
          <span className={styles.thinking} role="status">
            <span className={styles.thinkingDot} aria-hidden="true" />
            Generating — the assistant only reads records you can access…
          </span>
        ) : ai.isError ? (
          <span className={styles.errorText} role="alert">
            The assistant could not respond.{' '}
            <button type="button" onClick={ai.retry}>
              Retry
            </button>
          </span>
        ) : (
          ai.text
        )}
      </div>
      {ai.text ? (
        <div className={styles.outputActions}>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={ai.regenerate}
            disabled={ai.isPending}
          >
            <RefreshCw size={14} aria-hidden="true" />
            Regenerate
          </button>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={copy}
          >
            {copied ? (
              <Check size={14} aria-hidden="true" />
            ) : (
              <Copy size={14} aria-hidden="true" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      ) : null}
    </>
  );
}
