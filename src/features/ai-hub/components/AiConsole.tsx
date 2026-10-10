import { Sparkles } from 'lucide-react';
import type { useAiHub } from '../hooks/useAiHub';
import { CONSOLE_TASKS } from '../hooks/useAiHub';
import { AiOutput } from './AiOutput';
import styles from './ai-hub.module.css';

export function AiConsole({ hub }: { hub: ReturnType<typeof useAiHub> }) {
  return (
    <section className={styles.panel} aria-labelledby="ai-console-title">
      <div className={styles.panelHeader}>
        <h2 id="ai-console-title" className={styles.panelTitle}>
          Ask the assistant
        </h2>
      </div>
      <div className={styles.panelBody}>
        <div className={styles.taskPills} role="tablist" aria-label="Task">
          {CONSOLE_TASKS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={hub.task === t.id}
              className={`${styles.taskPill} ${hub.task === t.id ? styles.taskPillActive : ''}`}
              onClick={() => hub.setTask(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          className={styles.input}
          type="text"
          placeholder="What is it about? e.g. Q3 vehicle procurement tender"
          aria-label="Subject"
          value={hub.subject}
          onChange={(event) => hub.setSubject(event.target.value)}
        />
        <textarea
          className={styles.textarea}
          placeholder="Optional source material — paste text, bullet points, or details the AI should use"
          aria-label="Source material"
          value={hub.context}
          onChange={(event) => hub.setContext(event.target.value)}
        />
        <div className={styles.runRow}>
          <p className={styles.runHint}>
            Output is advisory — review before using it anywhere official.
          </p>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={!hub.subject.trim() || hub.ai.isPending}
            onClick={hub.runConsole}
          >
            <Sparkles size={15} aria-hidden="true" />
            {hub.ai.isPending ? 'Working…' : 'Generate'}
          </button>
        </div>
        <AiOutput ai={hub.ai} />
      </div>
    </section>
  );
}
