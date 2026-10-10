import type { RefObject } from 'react';
import { Bold, Italic, Link, List, ListOrdered } from 'lucide-react';
import {
  applyBlockStyle,
  applyInlineMarker,
  applyLink,
  applyListPrefix,
} from '../utils/bio-format';
import type { BioBlockStyle } from '../utils/bio-format';
import styles from './settings.module.css';

interface BioToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  /** Called after a mutation so the form can resync the textarea value. */
  onMutate: () => void;
}

const STYLE_OPTIONS: { value: BioBlockStyle; label: string }[] = [
  { value: 'normal', label: 'Normal text' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'quote', label: 'Quote' },
];

export function BioToolbar({ textareaRef, onMutate }: BioToolbarProps) {
  const apply = (mutate: (el: HTMLTextAreaElement) => void) => {
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    mutate(el);
    onMutate();
  };

  return (
    <div className={styles.bioToolbar} role="toolbar" aria-label="Bio formatting">
      <select
        className={styles.toolbarSelect}
        aria-label="Text style"
        defaultValue="normal"
        onChange={(event) => {
          const style =
            STYLE_OPTIONS.find((option) => option.value === event.target.value)
              ?.value ?? 'normal';
          apply((el) => applyBlockStyle(el, style));
        }}
      >
        {STYLE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className={styles.toolbarButton}
        aria-label="Bold"
        onClick={() => apply((el) => applyInlineMarker(el, '**'))}
      >
        <Bold size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        aria-label="Italic"
        onClick={() => apply((el) => applyInlineMarker(el, '*'))}
      >
        <Italic size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        aria-label="Insert link"
        onClick={() => apply(applyLink)}
      >
        <Link size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        aria-label="Bulleted list"
        onClick={() => apply((el) => applyListPrefix(el, false))}
      >
        <List size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        aria-label="Numbered list"
        onClick={() => apply((el) => applyListPrefix(el, true))}
      >
        <ListOrdered size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
