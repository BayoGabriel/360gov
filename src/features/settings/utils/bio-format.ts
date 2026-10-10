/**
 * Lightweight markup helpers for the bio field toolbar. They operate on the
 * textarea DOM selection and mutate its value via setRangeText; callers are
 * responsible for syncing the new value back into form state.
 */

export type BioBlockStyle = 'normal' | 'h1' | 'h2' | 'quote';

const BLOCK_PREFIX = /^(?:#{1,6}|>|\d+\.|-) /;
const BLOCK_PREFIXES: Record<BioBlockStyle, string> = {
  normal: '',
  h1: '# ',
  h2: '## ',
  quote: '> ',
};

function selectedLineBounds(el: HTMLTextAreaElement): {
  start: number;
  end: number;
} {
  const { selectionStart, selectionEnd, value } = el;
  const start =
    selectionStart === 0
      ? 0
      : value.lastIndexOf('\n', selectionStart - 1) + 1;
  const endIndex = value.indexOf('\n', selectionEnd);
  return { start, end: endIndex === -1 ? value.length : endIndex };
}

function mapSelectedLines(
  el: HTMLTextAreaElement,
  map: (line: string, index: number) => string,
): void {
  const { start, end } = selectedLineBounds(el);
  const next = el.value
    .slice(start, end)
    .split('\n')
    .map(map)
    .join('\n');
  el.setRangeText(next, start, end, 'end');
}

/** Wraps the selected text in an inline marker such as ** or *. */
export function applyInlineMarker(
  el: HTMLTextAreaElement,
  marker: string,
): void {
  const { selectionStart: start, selectionEnd: end, value } = el;
  const selected = value.slice(start, end) || 'text';
  el.setRangeText(`${marker}${selected}${marker}`, start, end, 'select');
}

/** Formats the selected text as a markdown-style link. */
export function applyLink(el: HTMLTextAreaElement): void {
  const { selectionStart: start, selectionEnd: end, value } = el;
  const selected = value.slice(start, end) || 'link text';
  el.setRangeText(`[${selected}](https://)`, start, end, 'end');
}

/** Sets or clears the block-level marker on every selected line. */
export function applyBlockStyle(
  el: HTMLTextAreaElement,
  style: BioBlockStyle,
): void {
  const prefix = BLOCK_PREFIXES[style];
  mapSelectedLines(el, (line) => {
    const stripped = line.replace(BLOCK_PREFIX, '');
    return `${prefix}${stripped}`;
  });
}

/** Prefixes every selected line as a bullet or numbered list item. */
export function applyListPrefix(
  el: HTMLTextAreaElement,
  numbered: boolean,
): void {
  mapSelectedLines(el, (line, index) => {
    const stripped = line.replace(BLOCK_PREFIX, '');
    const marker = numbered ? `${index + 1}. ` : '- ';
    return `${marker}${stripped}`;
  });
}
