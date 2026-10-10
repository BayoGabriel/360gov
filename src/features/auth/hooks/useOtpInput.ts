import { useRef } from 'react';
import type { ClipboardEvent, KeyboardEvent } from 'react';

interface UseOtpInputOptions {
  length: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
}

export function useOtpInput({
  length,
  value,
  onChange,
  onComplete,
}: UseOtpInputOptions) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const commit = (next: string) => {
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  const focusInput = (index: number) => {
    inputRefs.current[Math.max(0, Math.min(index, length - 1))]?.focus();
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    if (raw && !digit) return;
    const next = [...digits];
    next[index] = digit;
    commit(next.join(''));
    if (digit) focusInput(index + 1);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        event.preventDefault();
        const next = [...digits];
        next[index - 1] = '';
        commit(next.join(''));
        focusInput(index - 1);
      }
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusInput(index - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length);
    if (!pasted) return;
    commit(pasted);
    focusInput(Math.min(pasted.length, length - 1));
  };

  const setRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  return { digits, setRef, handleChange, handleKeyDown, handlePaste };
}
