import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { SelectField } from '../../../shared/components/FormField';
import { useReportingOverview } from '../../reporting';
import type { AiCapability } from '../ai-capabilities';
import { useEntityOptions } from '../hooks/useEntityOptions';
import type { useAiHub } from '../hooks/useAiHub';
import { AiOutput } from './AiOutput';
import styles from './ai-hub.module.css';

type Hub = ReturnType<typeof useAiHub>;

interface CapabilityRunDialogProps {
  capability: AiCapability;
  hub: Hub;
  onClose: () => void;
}

export function CapabilityRunDialog({
  capability,
  hub,
  onClose,
}: CapabilityRunDialogProps) {
  const { ai } = hub;
  const { options, pending } = useEntityOptions(capability.source);
  const report = useReportingOverview();
  const [selectedId, setSelectedId] = useState('');
  const [subject, setSubject] = useState('');
  const [context, setContext] = useState('');
  const started = useRef(false);

  const kind = capability.source.kind;
  const selected = options.find((o) => o.id === selectedId);
  const canRun =
    kind === 'freeform' ? Boolean(subject.trim()) : Boolean(selected);

  const runEntity = () => {
    if (!selected) return;
    hub.run(
      {
        task: capability.task,
        purpose: capability.purpose,
        subject: selected.subject,
        context: selected.context,
      },
      capability.title,
    );
  };

  const runFreeform = () => {
    if (!subject.trim()) return;
    hub.run(
      {
        task: capability.task,
        purpose: capability.purpose,
        subject: subject.trim(),
        context: context.trim() || undefined,
      },
      capability.title,
    );
  };

  useEffect(() => {
    ai.reset();
    if (kind !== 'report' || started.current || !report.data) return;
    started.current = true;
    hub.run(
      {
        task: capability.task,
        purpose: capability.purpose,
        subject: 'Processing performance overview',
        context: `${report.data.stats
          .map((s) => `${s.label}: ${s.value}`)
          .join('. ')}. Officers active now: ${report.data.activeNow.total}.`,
      },
      capability.title,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report.data, kind]);

  return (
    <Modal open onClose={onClose} title={capability.title}>
      <div className={styles.dialogBody}>
        <p className={styles.hint}>{capability.hint}</p>
        {kind === 'document' || kind === 'contract' ? (
          <>
            <SelectField
              label={kind === 'document' ? 'File' : 'Contract'}
              value={selectedId}
              placeholder={pending ? 'Loading…' : 'Select a record'}
              options={options.map((o) => ({ value: o.id, label: o.label }))}
              onChange={setSelectedId}
              disabled={pending}
            />
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryButton}
                disabled={!canRun || ai.isPending}
                onClick={runEntity}
              >
                <Sparkles size={15} aria-hidden="true" />
                {ai.isPending ? 'Working…' : 'Generate'}
              </button>
            </div>
          </>
        ) : kind === 'freeform' ? (
          <>
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
              placeholder="Source material (optional)"
              aria-label="Source material"
              value={context}
              onChange={(event) => setContext(event.target.value)}
            />
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryButton}
                disabled={!canRun || ai.isPending}
                onClick={runFreeform}
              >
                <Sparkles size={15} aria-hidden="true" />
                {ai.isPending ? 'Working…' : 'Generate'}
              </button>
            </div>
          </>
        ) : null}
        {kind === 'report' && report.isPending ? (
          <p className={styles.hint}>Loading reporting overview…</p>
        ) : null}
        <AiOutput ai={ai} />
        <p className={styles.disclaimer}>
          AI operates within your access permissions and never acts on your
          behalf. Output is advisory — verify before use.
        </p>
      </div>
    </Modal>
  );
}
