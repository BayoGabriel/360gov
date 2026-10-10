import { useAuth } from '../../../app/providers/auth-context';
import { DEFAULT_ROLE, isTopLevelRole } from '../../../shared/auth/roles';
import type { UnitAccess } from '../types/department-files.types';

export interface DepartmentAccess {
  isAdmin: boolean;
  /** Undefined for top-level roles (full "All Departments" access). */
  access: UnitAccess | undefined;
  /** True when the user may browse the given department. */
  canViewDepartment: (departmentId: string) => boolean;
  /** True when the user may browse the given sub-unit. */
  canViewUnit: (departmentId: string, unitId: string) => boolean;
}

/**
 * Resolves the signed-in user's department-file access from their role:
 * permanent secretary / DG see all departments, a department head only
 * their department, and staff only their sub-unit.
 */
export function useDepartmentAccess(): DepartmentAccess {
  const { session } = useAuth();
  const user = session.status === 'authenticated' ? session.user : undefined;
  const role = user?.role ?? DEFAULT_ROLE;
  const isAdmin = isTopLevelRole(role);
  const access = isAdmin
    ? undefined
    : { departmentId: user?.departmentId, unitId: user?.unitId };

  return {
    isAdmin,
    access,
    canViewDepartment: (departmentId) =>
      isAdmin || !access?.departmentId || departmentId === access.departmentId,
    canViewUnit: (departmentId, unitId) =>
      isAdmin ||
      (!!access &&
        (!access.departmentId || departmentId === access.departmentId) &&
        (!access.unitId || unitId === access.unitId)),
  };
}
