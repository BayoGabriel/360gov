import type { FileComment } from '../../types/documents.types';

export type CommentSort = 'date-desc' | 'date-asc' | 'name' | 'views';

export const COMMENT_SORT_OPTIONS: { id: CommentSort; label: string }[] = [
  { id: 'date-desc', label: 'Date (newest)' },
  { id: 'date-asc', label: 'Date (oldest)' },
  { id: 'name', label: 'Name (A–Z)' },
  { id: 'views', label: 'Most viewed' },
];

export function sortComments(
  comments: FileComment[],
  sort: CommentSort,
): FileComment[] {
  const sorted = [...comments];
  switch (sort) {
    case 'date-asc':
      sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      break;
    case 'name':
      sorted.sort((a, b) => a.author.name.localeCompare(b.author.name));
      break;
    case 'views':
      sorted.sort((a, b) => b.views - a.views);
      break;
    default:
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return sorted;
}
