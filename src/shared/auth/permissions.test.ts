import { describe, expect, it } from 'vitest';
import type { AppRole } from './roles';
import { APP_ROLES } from './roles';
import { can, type Capability, type CapabilityUser } from './permissions';

const ALL_CAPABILITIES: Capability[] = [
  'screen.procurement',
  'screen.reports',
  'screen.users',
  'document.assign',
  'document.forward',
  'document.revision',
  'document.approve',
  'document.final-approve',
  'document.archive',
];

const DEPARTMENT = 'corporate-services';
const UNIT = 'corporate-services-facility-maintenance';

function userOf(role: AppRole, unitId?: string): CapabilityUser {
  return { role, departmentId: DEPARTMENT, unitId };
}

function capabilitiesOf(user: CapabilityUser): Capability[] {
  return ALL_CAPABILITIES.filter((capability) => can(user, capability));
}

describe('can() document workflow capabilities', () => {
  it('gives the EVC final approval and routing, but never submission to the EVC', () => {
    expect(capabilitiesOf({ role: 'evc' })).toEqual(
      expect.arrayContaining([
        'screen.procurement',
        'screen.reports',
        'screen.users',
        'document.forward',
        'document.revision',
        'document.final-approve',
        'document.archive',
      ]),
    );
    // The EVC is the EVC: no "submit to EVC", no unit assignment.
    expect(can({ role: 'evc' }, 'document.approve')).toBe(false);
    expect(can({ role: 'evc' }, 'document.assign')).toBe(false);
  });

  it('lets the department secretariat forward and archive only', () => {
    expect(
      capabilitiesOf(userOf('department-secretariat')),
    ).toEqual(['screen.reports', 'document.forward', 'document.archive']);
  });

  it('lets the head of department assign, forward, revise and submit to the EVC', () => {
    expect(capabilitiesOf(userOf('department-head'))).toEqual([
      'screen.reports',
      'document.assign',
      'document.forward',
      'document.revision',
      'document.approve',
    ]);
  });

  it('lets the head of unit assign to officers, return work and request revision', () => {
    expect(capabilitiesOf(userOf('unit-head', UNIT))).toEqual([
      'document.assign',
      'document.forward',
      'document.revision',
    ]);
  });

  it('lets the officer only return files upward', () => {
    expect(capabilitiesOf(userOf('officer', UNIT))).toEqual([
      'document.forward',
    ]);
  });
});

describe('can() screen capabilities', () => {
  it('restricts user management to the EVC', () => {
    for (const role of APP_ROLES) {
      expect(can(userOf(role), 'screen.users')).toBe(role === 'evc');
    }
  });

  it('restricts reporting to supervisory roles', () => {
    const allowed: AppRole[] = [
      'evc',
      'department-head',
      'department-secretariat',
    ];
    for (const role of APP_ROLES) {
      expect(can(userOf(role), 'screen.reports')).toBe(
        allowed.includes(role),
      );
    }
  });

  it('opens procurement to the EVC and procurement department members', () => {
    expect(can({ role: 'evc' }, 'screen.procurement')).toBe(true);
    expect(
      can(userOf('officer', UNIT), 'screen.procurement'),
    ).toBe(false);
    for (const role of APP_ROLES) {
      expect(
        can(
          { role, departmentId: 'procurement' },
          'screen.procurement',
        ),
      ).toBe(true);
    }
  });
});
