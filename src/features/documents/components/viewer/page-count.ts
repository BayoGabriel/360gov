import type { FileRecord } from '../../types/documents.types';

/** Derives a fake page count for fixture files (3–20 pages). */
export function pageCountFor(file: FileRecord): number {
  return Math.max(3, Math.min(20, Math.ceil(file.fileSizeBytes / 12_000)));
}
