import { X } from 'lucide-react';
import { useMemoPanel } from '../hooks/useMemoPanel';
import { MemoComposer } from './MemoComposer';
import { MemoPanelBar } from './MemoPanelBar';
import { MemoPanelTabs } from './MemoPanelTabs';
import { MemoParticipants } from './MemoParticipants';
import { MemoThread } from './MemoThread';
import styles from './memos.module.css';

interface MemoDetailPanelProps {
  memoId: string;
  total: number;
  onClose: () => void;
}

export function MemoDetailPanel({ memoId, total, onClose }: MemoDetailPanelProps) {
  const panel = useMemoPanel(memoId);
  const detail = panel.detail.data;

  return (
    <aside
      className={`${styles.detailPanel} ${panel.expanded ? styles.detailPanelExpanded : ''}`}
      aria-label={detail ? `Memo ${detail.fileNo}` : 'Memo detail'}
    >
      <MemoPanelBar
        total={total}
        searchOpen={panel.searchOpen}
        expanded={panel.expanded}
        onToggleSearch={panel.toggleSearch}
        onToggleExpand={panel.toggleExpanded}
        onClose={onClose}
      />
      {panel.searchOpen && (
        <input
          type="search"
          className={styles.threadSearch}
          placeholder="Search messages"
          aria-label="Search messages"
          value={panel.messageQuery}
          onChange={(event) => panel.setMessageQuery(event.target.value)}
        />
      )}
      <div className={styles.detailSub}>
        <h3 className={styles.detailFileNo}>{detail?.fileNo ?? '…'}</h3>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Close memo"
          onClick={onClose}
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <MemoPanelTabs
        tab={panel.tab}
        participantCount={detail?.participants.length ?? 0}
        onChange={panel.setTab}
      />
      <div className={styles.detailBody}>
        {panel.detail.isPending ? (
          <p className={styles.status} role="status">
            Loading memo…
          </p>
        ) : panel.detail.isError || !detail ? (
          <div className={styles.status} role="alert">
            <p>The memo could not be loaded.</p>
            <button type="button" onClick={() => void panel.detail.refetch()}>
              Retry
            </button>
          </div>
        ) : panel.tab === 'messages' ? (
          <MemoThread
            messages={panel.visibleMessages}
            loading={panel.messages.isPending}
            error={panel.messages.isError}
            onRetry={() => void panel.messages.refetch()}
          />
        ) : (
          <MemoParticipants participants={detail.participants} />
        )}
      </div>
      <MemoComposer
        pending={panel.send.isPending}
        error={panel.send.isError}
        onSend={panel.sendMessage}
        aiSubject={detail ? `${detail.fileNo} — ${detail.subject}` : undefined}
        aiContext={
          detail
            ? `Participants: ${detail.participants.map((p) => p.name).join(', ')}.`
            : undefined
        }
      />
    </aside>
  );
}
