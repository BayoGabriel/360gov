import { ArrowRight } from 'lucide-react';
import type { AiCapability } from '../ai-capabilities';
import styles from './ai-hub.module.css';

interface CapabilityCardProps {
  capability: AiCapability;
  onRun: (capability: AiCapability) => void;
}

export function CapabilityCard({ capability, onRun }: CapabilityCardProps) {
  const Icon = capability.icon;
  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onRun(capability)}
    >
      <span className={styles.cardIcon} aria-hidden="true">
        <Icon size={18} />
      </span>
      <h3 className={styles.cardTitle}>{capability.title}</h3>
      <p className={styles.cardDesc}>{capability.description}</p>
      <span className={styles.cardRun}>
        Run
        <ArrowRight size={14} aria-hidden="true" />
      </span>
    </button>
  );
}
