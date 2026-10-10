import { Modal } from '../../../shared/components/Modal';
import { useAiHub } from '../hooks/useAiHub';
import { AiConsole } from './AiConsole';
import { AiHistoryPanel } from './AiHistoryPanel';
import { AiHubHero } from './AiHubHero';
import { CapabilityGrid } from './CapabilityGrid';
import { CapabilityRunDialog } from './CapabilityRunDialog';
import styles from './ai-hub.module.css';

export function AiHubPage() {
  const hub = useAiHub();

  return (
    <div className={styles.page}>
      <AiHubHero />
      <div className={styles.contentRow}>
        <div className={styles.hubMain}>
          <AiConsole hub={hub} />
          <CapabilityGrid onRun={hub.openCapability} />
        </div>
        <AiHistoryPanel entries={hub.history} onView={hub.viewEntry} />
      </div>
      {hub.capability ? (
        <CapabilityRunDialog
          capability={hub.capability}
          hub={hub}
          onClose={hub.closeCapability}
        />
      ) : null}
      {hub.viewing ? (
        <Modal
          open
          onClose={hub.closeViewing}
          title={hub.viewing.label}
        >
          <div className={styles.dialogBody}>
            <p className={styles.hint}>{hub.viewing.subject}</p>
            <div className={styles.output}>{hub.viewing.text}</div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
