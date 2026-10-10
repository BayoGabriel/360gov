import { useState } from 'react';
import { useApproveUser, useForwardUser } from '../queries/users.mutations';
import type { UserAction, UserRecord } from '../types/users.types';

export type UsersDialog =
  | { kind: 'add' | 'filter' }
  | {
      kind: 'deactivate' | 'assign-role' | 'reset-password';
      user: UserRecord;
    }
  | null;

export function useUserDialogs() {
  const [dialog, setDialog] = useState<UsersDialog>(null);
  const approve = useApproveUser();
  const forward = useForwardUser();

  const onAction = (action: UserAction, user: UserRecord) => {
    switch (action) {
      case 'approve':
        approve.mutate(user.id);
        break;
      case 'forward':
        forward.mutate(user.id);
        break;
      default:
        setDialog({ kind: action, user });
        break;
    }
  };
  const openAdd = () => setDialog({ kind: 'add' });
  const openFilter = () => setDialog({ kind: 'filter' });
  const close = () => setDialog(null);

  return { dialog, onAction, openAdd, openFilter, close };
}
