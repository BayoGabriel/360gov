const monthFormatter = new Intl.DateTimeFormat('en', { month: 'long' });
const timeFormatter = new Intl.DateTimeFormat('en', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

function ordinal(day: number): string {
  const teen = day % 100;
  if (teen >= 11 && teen <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

/** Formats a date as "June 18th 2023 - 08:34 am" for the dashboard topbar. */
export function formatDashboardTimestamp(date: Date): string {
  const month = monthFormatter.format(date);
  const day = ordinal(date.getDate());
  const time = timeFormatter.format(date).toLowerCase();
  return `${month} ${day} ${date.getFullYear()} - ${time}`;
}

const shortDateFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
});

/** Formats an ISO timestamp as "Aug 02, 2023 - 04:50 PM" for list rows. */
export function formatListTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = shortDateFormatter.format(date);
  const time = timeFormatter.format(date).toUpperCase();
  return `${day} - ${time}`;
}

const DAY_MS = 86_400_000;

/** Formats an ISO timestamp as "17 days ago at 7:47 am". */
export function formatDaysAgo(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / DAY_MS));
  const label = days === 1 ? '1 day' : `${days} days`;
  const time = timeFormatter.format(date).toLowerCase();
  return `${label} ago at ${time}`;
}

const longDateFormatter = new Intl.DateTimeFormat('en', {
  month: 'long',
  day: '2-digit',
  year: 'numeric',
});

/** Formats an ISO date as "June 07, 2022" for card and list cells. */
export function formatLongDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return longDateFormatter.format(date);
}

const uploadDateFormatter = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

/** Formats an ISO timestamp as "Tuesday, 20 August 2024 7:13AM". */
export function formatUploadedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const time = timeFormatter.format(date).replace(' ', '').toUpperCase();
  return `${uploadDateFormatter.format(date)} ${time}`;
}

const commentDateFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
});

/** Formats an ISO timestamp as "Aug 14 at 7:47 am" for comment headers. */
export function formatCommentDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const time = timeFormatter.format(date).toLowerCase();
  return `${commentDateFormatter.format(date)} at ${time}`;
}
