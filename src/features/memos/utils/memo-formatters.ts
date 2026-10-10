const weekdayFormatter = new Intl.DateTimeFormat('en', { weekday: 'long' });
const dateFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const DAY_MS = 86_400_000;

function dayStart(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** Formats a timestamp as "Thursday 11:44am" for message metadata. */
export function formatMemoTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const hours = date.getHours();
  const h = hours % 12 || 12;
  const m = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours < 12 ? 'am' : 'pm';
  return `${weekdayFormatter.format(date)} ${h}:${m}${ampm}`;
}

/**
 * Returns a divider label for a message's calendar day:
 * "Today", "Yesterday", a weekday for the past week, or "Jan 6, 2022".
 */
export function formatDayLabel(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const diff = Math.floor((dayStart(now) - dayStart(date)) / DAY_MS);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return weekdayFormatter.format(date);
  return dateFormatter.format(date);
}

/** Calendar-day key used to group messages under dividers. */
export function messageDayKey(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toDateString();
}
