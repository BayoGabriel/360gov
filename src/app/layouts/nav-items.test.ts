import { describe, expect, it } from 'vitest';
import type { CapabilityUser } from '../../shared/auth/permissions';
import { NAV_ITEMS, navItemsFor } from './nav-items';

const ALL_PATHS = NAV_ITEMS.map((item) => item.to);

function pathsFor(user: CapabilityUser): string[] {
  return navItemsFor(user).map((item) => item.to);
}

const corpOfficer: CapabilityUser = {
  role: 'officer',
  departmentId: 'corporate-services',
  unitId: 'corporate-services-facility-maintenance',
};

describe('navItemsFor', () => {
  it('shows the EVC every screen', () => {
    expect(pathsFor({ role: 'evc' })).toEqual(ALL_PATHS);
  });

  it('hides user management and reporting from officers and unit heads', () => {
    for (const user of [
      corpOfficer,
      { ...corpOfficer, role: 'unit-head' as const },
    ]) {
      const paths = pathsFor(user);
      expect(paths).not.toContain('/users');
      expect(paths).not.toContain('/reports');
      expect(paths).toContain('/documents');
      expect(paths).toContain('/department-files');
    }
  });

  it('shows reporting to heads of department and secretariat', () => {
    for (const role of [
      'department-head',
      'department-secretariat',
    ] as const) {
      expect(
        pathsFor({ role, departmentId: 'corporate-services' }),
      ).toContain('/reports');
    }
    expect(pathsFor({ role: 'department-head' })).not.toContain('/users');
  });

  it('shows procurement only to the EVC and procurement members', () => {
    expect(pathsFor(corpOfficer)).not.toContain('/procurement');
    expect(
      pathsFor({
        role: 'officer',
        departmentId: 'procurement',
        unitId: 'procurement-planning-research-data-management',
      }),
    ).toContain('/procurement');
    expect(
      pathsFor({ role: 'department-head', departmentId: 'procurement' }),
    ).toContain('/procurement');
  });
});
