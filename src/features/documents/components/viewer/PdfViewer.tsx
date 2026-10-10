import { useState } from 'react';
import type { ReactNode } from 'react';
import type { FileRecord } from '../../types/documents.types';
import styles from '../../documents.module.css';
import { pageCountFor } from './page-count';
import { PdfPageCanvas } from './PdfPageCanvas';
import { PdfToolbar } from './PdfToolbar';
import { TocSidebar } from './TocSidebar';

interface PdfViewerProps {
  file: FileRecord;
  onClose: () => void;
  /** Optional action bar rendered between the toolbar and the page. */
  actionBar?: ReactNode;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.25;

export function PdfViewer({ file, onClose, actionBar }: PdfViewerProps) {
  const totalPages = pageCountFor(file);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const zoomBy = (delta: number) =>
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)));

  return (
    <div className={styles.pdfViewer}>
      <PdfToolbar
        title={file.subject}
        fileName={file.fileName}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onZoomIn={() => zoomBy(ZOOM_STEP)}
        onZoomOut={() => zoomBy(-ZOOM_STEP)}
        onToggleSearch={() => {
          setSearchOpen((v) => !v);
          setSearch('');
        }}
        onClose={onClose}
      />
      {actionBar}
      {searchOpen ? (
        <input
          className={styles.pdfSearch}
          type="search"
          placeholder="Go to page…"
          aria-label="Find page by number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      ) : null}
      <div className={styles.pdfBody}>
        <TocSidebar
          totalPages={totalPages}
          current={page}
          filter={search}
          onSelect={setPage}
        />
        <PdfPageCanvas file={file} page={page} scale={zoom} />
      </div>
    </div>
  );
}
