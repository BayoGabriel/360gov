import { HardDrive, Mail } from 'lucide-react';
import { WORKSPACE_TABS, type WorkspaceTab } from '../hooks/useWorkspacePage';
import styles from './workspace.module.css';

const TAB_ICONS: Record<WorkspaceTab, typeof HardDrive> = {
  drive: HardDrive,
  mail: Mail,
};

interface WorkspaceTabsProps {
  tab: WorkspaceTab;
  onChange: (tab: WorkspaceTab) => void;
}

export function WorkspaceTabs({ tab, onChange }: WorkspaceTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Workspace sections">
      {WORKSPACE_TABS.map((t) => {
        const Icon = TAB_ICONS[t.id];
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
            onClick={() => onChange(t.id)}
          >
            <Icon size={15} aria-hidden="true" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
