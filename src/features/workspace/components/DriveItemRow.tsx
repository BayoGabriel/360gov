import {
  File,
  FileSpreadsheet,
  FileText,
  Folder,
  Image,
  Star,
} from 'lucide-react';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import { formatFileSize } from '../../../shared/lib/format-file-size';
import type { DriveItem, DriveItemKind } from '../types/workspace.types';
import styles from './workspace.module.css';

const KIND_ICONS: Record<DriveItemKind, typeof File> = {
  folder: Folder,
  doc: FileText,
  sheet: FileSpreadsheet,
  pdf: File,
  image: Image,
  file: File,
};

const KIND_ICON_CLASS: Record<DriveItemKind, string> = {
  folder: styles.itemIconFolder,
  doc: styles.itemIconDoc,
  sheet: styles.itemIconSheet,
  pdf: styles.itemIconPdf,
  image: styles.itemIconImage,
  file: '',
};

interface DriveItemRowProps {
  item: DriveItem;
  onOpen: (item: DriveItem) => void;
  onToggleStar: (itemId: string) => void;
}

export function DriveItemRow({ item, onOpen, onToggleStar }: DriveItemRowProps) {
  const Icon = KIND_ICONS[item.kind];
  return (
    <tr>
      <td>
        <span className={styles.itemName}>
          <span
            className={`${styles.itemIcon} ${KIND_ICON_CLASS[item.kind]}`}
            aria-hidden="true"
          >
            <Icon size={17} />
          </span>
          <button
            type="button"
            className={styles.itemButton}
            onClick={() => onOpen(item)}
            title={item.name}
          >
            {item.name}
          </button>
        </span>
      </td>
      <td>{item.owner}</td>
      <td>{formatListTimestamp(item.modifiedAt)}</td>
      <td>{item.sizeBytes != null ? formatFileSize(item.sizeBytes) : '—'}</td>
      <td>
        <button
          type="button"
          className={`${styles.starButton} ${item.starred ? styles.starred : ''}`}
          aria-label={item.starred ? 'Unstar' : 'Star'}
          aria-pressed={item.starred}
          onClick={() => onToggleStar(item.id)}
        >
          <Star size={15} fill={item.starred ? 'currentColor' : 'none'} />
        </button>
      </td>
    </tr>
  );
}
