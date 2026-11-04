import { useRef, useState, type ChangeEvent } from 'react';
import { FolderPlus, Search, Upload } from 'lucide-react';
import {
  useDriveBreadcrumbs,
  useDriveItems,
} from '../queries/workspace.queries';
import {
  useToggleDriveStar,
  useUploadDriveFile,
} from '../queries/workspace.mutations';
import type { DriveItem } from '../types/workspace.types';
import { DriveItemRow } from './DriveItemRow';
import { NewFolderDialog } from './NewFolderDialog';
import styles from './workspace.module.css';

interface DriveBrowserProps {
  folderId: string | null;
  query: string;
  onNavigate: (folderId: string | null) => void;
  onOpenFile: (itemId: string) => void;
  onSearch: (query: string) => void;
}

export function DriveBrowser({
  folderId,
  query,
  onNavigate,
  onOpenFile,
  onSearch,
}: DriveBrowserProps) {
  const { data: items, isPending, isError, refetch } = useDriveItems(folderId, query);
  const { data: crumbs } = useDriveBreadcrumbs(folderId);
  const toggleStar = useToggleDriveStar();
  const upload = useUploadDriveFile();
  const fileInput = useRef<HTMLInputElement>(null);
  const [newFolder, setNewFolder] = useState(false);

  const openItem = (item: DriveItem) => {
    if (item.kind === 'folder') onNavigate(item.id);
    else onOpenFile(item.id);
  };

  const pickFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) upload.mutate({ parentId: folderId, file });
    event.target.value = '';
  };

  return (
    <section className={styles.panel} aria-label="Drive">
      <div className={styles.panelHeader}>
        <div className={styles.driveToolbar}>
          <nav className={styles.crumbs} aria-label="Drive path">
            {(crumbs ?? [{ id: null, name: 'My Drive' }]).map((crumb, i, list) => (
              <span key={crumb.id ?? 'root'}>
                {i > 0 && (
                  <span className={styles.crumbSep} aria-hidden="true">
                    /
                  </span>
                )}
                <button
                  type="button"
                  className={`${styles.crumb} ${i === list.length - 1 ? styles.crumbCurrent : ''}`}
                  onClick={() => onNavigate(crumb.id)}
                  aria-current={i === list.length - 1 ? 'page' : undefined}
                >
                  {crumb.name}
                </button>
              </span>
            ))}
          </nav>
          <div className={styles.toolbarActions}>
            <label className={styles.search}>
              <Search size={14} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search Drive"
                aria-label="Search Drive"
                value={query}
                onChange={(event) => onSearch(event.target.value)}
              />
            </label>
            <button
              type="button"
              className={styles.outlineButton}
              onClick={() => setNewFolder(true)}
            >
              <FolderPlus size={15} aria-hidden="true" />
              New folder
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              disabled={upload.isPending}
              onClick={() => fileInput.current?.click()}
            >
              <Upload size={15} aria-hidden="true" />
              {upload.isPending ? 'Uploading…' : 'Upload'}
            </button>
            <input
              ref={fileInput}
              type="file"
              hidden
              onChange={pickFile}
              aria-label="Upload file"
            />
          </div>
        </div>
      </div>
      <div className={styles.tableWrap}>
        {isPending ? (
          <p className={styles.status}>Loading files…</p>
        ) : isError ? (
          <div className={styles.status} role="alert">
            <p>Drive could not be loaded.</p>
            <button type="button" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        ) : !items?.length ? (
          <p className={styles.status}>
            {query ? 'No files match your search.' : 'This folder is empty.'}
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Owner</th>
                <th scope="col">Modified</th>
                <th scope="col">Size</th>
                <th scope="col">
                  <span className={styles.visuallyHidden}>Starred</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <DriveItemRow
                  key={item.id}
                  item={item}
                  onOpen={openItem}
                  onToggleStar={(id) => toggleStar.mutate(id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
      {newFolder ? (
        <NewFolderDialog parentId={folderId} onClose={() => setNewFolder(false)} />
      ) : null}
    </section>
  );
}
