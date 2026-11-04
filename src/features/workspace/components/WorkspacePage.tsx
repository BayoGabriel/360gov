import { useState } from 'react';
import { useWorkspacePage } from '../hooks/useWorkspacePage';
import { AccountChip } from './AccountChip';
import { DocViewerDialog } from './DocViewerDialog';
import { DriveBrowser } from './DriveBrowser';
import { MailInbox } from './MailInbox';
import { NewMailDialog } from './NewMailDialog';
import { WorkspaceTabs } from './WorkspaceTabs';
import styles from './workspace.module.css';

export function WorkspacePage() {
  const page = useWorkspacePage();
  const [composing, setComposing] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Workspace</h1>
          <p className={styles.pageSub}>
            Drive, mail and documents from your connected Google account — in
            one place, within your permissions.
          </p>
        </div>
        <AccountChip />
      </div>
      <WorkspaceTabs tab={page.tab} onChange={page.setTab} />
      {page.tab === 'drive' ? (
        <DriveBrowser
          folderId={page.folderId}
          query={page.query}
          onNavigate={page.openFolder}
          onOpenFile={page.openFile}
          onSearch={page.setQuery}
        />
      ) : (
        <MailInbox
          threadId={page.threadId}
          onOpenThread={page.openThread}
          onCloseThread={page.closeThread}
          onCompose={() => setComposing(true)}
        />
      )}
      {page.fileId ? (
        <DocViewerDialog itemId={page.fileId} onClose={page.closeFile} />
      ) : null}
      {composing ? (
        <NewMailDialog onClose={() => setComposing(false)} />
      ) : null}
    </div>
  );
}
