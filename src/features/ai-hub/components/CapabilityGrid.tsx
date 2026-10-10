import {
  AI_CAPABILITIES,
  CAPABILITY_CATEGORIES,
  type AiCapability,
} from '../ai-capabilities';
import { CapabilityCard } from './CapabilityCard';
import styles from './ai-hub.module.css';

interface CapabilityGridProps {
  onRun: (capability: AiCapability) => void;
}

export function CapabilityGrid({ onRun }: CapabilityGridProps) {
  return (
    <>
      {CAPABILITY_CATEGORIES.map((category) => {
        const items = AI_CAPABILITIES.filter((c) => c.category === category);
        if (items.length === 0) return null;
        return (
          <section
            key={category}
            className={styles.categorySection}
            aria-label={category}
          >
            <h2 className={styles.categoryTitle}>{category}</h2>
            <div className={styles.cardGrid}>
              {items.map((capability) => (
                <CapabilityCard
                  key={capability.id}
                  capability={capability}
                  onRun={onRun}
                />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
