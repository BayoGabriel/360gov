import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { AiTask } from '../../ai/ai.types';
import { AiAssistDialog } from './AiAssistDialog';
import styles from './AiAssist.module.css';

type AiAssistVariant = 'button' | 'link' | 'icon';

const TASK_LABELS: Record<AiTask, string> = {
  summarize: 'Summarize',
  draft: 'Draft with AI',
  describe: 'Describe with AI',
  reply: 'Suggest a reply',
  improve: 'Improve with AI',
};

const TASK_TITLES: Record<AiTask, string> = {
  summarize: 'AI Summary',
  draft: 'AI Draft',
  describe: 'AI Description',
  reply: 'AI Suggested Reply',
  improve: 'AI Rewrite',
};

interface AiAssistProps {
  task: AiTask;
  /** Audit label for the invocation point, e.g. 'document-summary'. */
  purpose: string;
  /** What is being summarized/drafted, shown to the officer. */
  subject: string;
  /** Source material the AI may draw on (permission-scoped server-side). */
  context?: string;
  /** Overrides the default button label. */
  label?: string;
  variant?: AiAssistVariant;
  /** When provided, the dialog offers an "Insert" action with the text. */
  onApply?: (text: string) => void;
}

/**
 * Standard AI affordance used across the app: renders a trigger that opens
 * the shared generation dialog. AI output is advisory text only.
 */
export function AiAssist({
  task,
  purpose,
  subject,
  context,
  label,
  variant = 'button',
  onApply,
}: AiAssistProps) {
  const [open, setOpen] = useState(false);
  const text = label ?? TASK_LABELS[task];

  const trigger =
    variant === 'icon' ? (
      <button
        type="button"
        className={styles.aiIcon}
        aria-label={text}
        title={text}
        onClick={() => setOpen(true)}
      >
        <Sparkles size={16} aria-hidden="true" />
      </button>
    ) : variant === 'link' ? (
      <button
        type="button"
        className={styles.aiLink}
        onClick={() => setOpen(true)}
      >
        <Sparkles size={14} aria-hidden="true" />
        {text}
      </button>
    ) : (
      <button
        type="button"
        className={styles.aiButton}
        onClick={() => setOpen(true)}
      >
        <Sparkles size={15} aria-hidden="true" />
        {text}
      </button>
    );

  return (
    <>
      {trigger}
      {open ? (
        <AiAssistDialog
          request={{ task, purpose, subject, context }}
          title={TASK_TITLES[task]}
          onApply={onApply}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
