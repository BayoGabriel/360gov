import type { UserFilters } from '../hooks/useUsersPage';
import type { UsersDialog } from '../hooks/useUserDialogs';
import { useUserFormOptions } from '../queries/users.queries';
import { AddUserDialog } from './AddUserDialog';
import { AssignRoleDialog } from './AssignRoleDialog';
import { DeactivateUserDialog } from './DeactivateUserDialog';
import { ResetPasswordDialog } from './ResetPasswordDialog';
import { UserFilterDialog } from './UserFilterDialog';

interface UserDialogsProps {
  dialog: UsersDialog;
  filters: UserFilters;
  onApplyFilters: (filters: UserFilters) => void;
  onClose: () => void;
}

export function UserDialogs({
  dialog,
  filters,
  onApplyFilters,
  onClose,
}: UserDialogsProps) {
  const formOptions = useUserFormOptions(
    dialog?.kind === 'add' || dialog?.kind === 'filter',
  );

  switch (dialog?.kind) {
    case 'add':
      return <AddUserDialog onClose={onClose} />;
    case 'filter':
      return (
        <UserFilterDialog
          options={formOptions.data}
          current={filters}
          onApply={onApplyFilters}
          onClose={onClose}
        />
      );
    case 'deactivate':
      return <DeactivateUserDialog user={dialog.user} onClose={onClose} />;
    case 'assign-role':
      return <AssignRoleDialog user={dialog.user} onClose={onClose} />;
    case 'reset-password':
      return <ResetPasswordDialog user={dialog.user} onClose={onClose} />;
    default:
      return null;
  }
}
