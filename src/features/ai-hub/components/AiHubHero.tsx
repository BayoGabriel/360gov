import { ScrollText, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import styles from './ai-hub.module.css';

const TRUST_CHIPS = [
  { icon: ShieldCheck, label: 'Permission-scoped' },
  { icon: ScrollText, label: 'Every request audit-logged' },
  { icon: UserCheck, label: 'Advisory — officers decide' },
];

export function AiHubHero() {
  return (
    <section className={styles.hero} aria-labelledby="ai-hub-title">
      <div className={styles.heroText}>
        <span className={styles.heroBadge}>
          <Sparkles size={12} aria-hidden="true" />
          AI Assistant
        </span>
        <h1 id="ai-hub-title" className={styles.heroTitle}>
          Your AI assistant for the Ministry
        </h1>
        <p className={styles.heroSub}>
          Summarize files and tenders, draft notes, memos and replies, and get
          insights from platform activity. The assistant only sees what you can
          see, never acts on your behalf, and records every request in the
          audit trail.
        </p>
        <div className={styles.trustRow}>
          {TRUST_CHIPS.map((chip) => (
            <span key={chip.label} className={styles.trustChip}>
              <chip.icon size={13} aria-hidden="true" />
              {chip.label}
            </span>
          ))}
        </div>
      </div>
      <span className={styles.heroIcon} aria-hidden="true">
        <Sparkles size={44} />
      </span>
    </section>
  );
}
