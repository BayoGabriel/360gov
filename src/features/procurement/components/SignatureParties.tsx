import { CheckCircle2, Circle } from 'lucide-react';
import type { SignatureInfo } from '../types/procurement.types';
import styles from './procurement.module.css';

export function SignatureParties({ signature }: { signature: SignatureInfo }) {
  return (
    <div className={styles.signRow}>
      {signature.parties.map((party) => {
        const signed = Boolean(party.signedAt);
        return (
          <span
            key={party.role}
            className={`${styles.signParty} ${signed ? styles.signPartySigned : ''}`}
          >
            {signed ? (
              <CheckCircle2 size={13} aria-hidden="true" />
            ) : (
              <Circle size={13} aria-hidden="true" />
            )}
            {party.role === 'ministry' ? 'Ministry' : 'Vendor'} — {party.name}
          </span>
        );
      })}
    </div>
  );
}
