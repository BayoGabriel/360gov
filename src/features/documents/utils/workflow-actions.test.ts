import { describe, expect, it } from 'vitest';
import type { CapabilityUser } from '../../../shared/auth/permissions';
import type { DocumentAction } from '../types/documents.types';
import {
  approveSuccessMessage,
  assignDialogTitle,
  documentActionsFor,
} from './workflow-actions';

const DEPARTMENT = 'corporate-services';
const UNIT = 'corporate-services-facility-maintenance';

function userOf(
  role: CapabilityUser['role'],
  unitId?: string,
): CapabilityUser {
  return { role, departmentId: DEPARTMENT, unitId };
}

function idsFor(user: CapabilityUser): DocumentAction[] {
  return documentActionsFor(user).map((spec) => spec.id);
}

function labelFor(user: CapabilityUser, id: DocumentAction) {
  return documentActionsFor(user).find((spec) => spec.id === id)?.label;
}

describe('documentActionsFor', () => {
  it('lets every role view, inspect the trail and add notes', () => {
    const users: CapabilityUser[] = [
      { role: 'evc' },
      userOf('department-secretariat'),
      userOf('department-head'),
      userOf('unit-head', UNIT),
      userOf('officer', UNIT),
    ];
    for (const user of users) {
      expect(idsFor(user).slice(0, 3)).toEqual([
        'view',
        'trail',
        'note',
      ]);
    }
  });

  it('gives the EVC Approve — never Submit to EVC', () => {
    const user = { role: 'evc' } as const;
    const labels = documentActionsFor(user).map((spec) => spec.label);
    expect(labels).toContain('Approve');
    expect(labels).not.toContain('Submit to EVC');
    expect(idsFor(user)).toEqual([
      'view',
      'trail',
      'note',
      'forward',
      'revision',
      'approve',
      'archive',
    ]);
  });

  it('gives the head of department the full supervisory chain', () => {
    const user = userOf('department-head');
    expect(idsFor(user)).toEqual([
      'view',
      'trail',
      'note',
      'assign',
      'forward',
      'revision',
      'approve',
    ]);
    expect(labelFor(user, 'approve')).toBe('Submit to EVC');
    expect(labelFor(user, 'assign')).toBe('Assign to Unit');
  });

  it('gives the secretariat forward and archive only', () => {
    expect(idsFor(userOf('department-secretariat'))).toEqual([
      'view',
      'trail',
      'note',
      'forward',
      'archive',
    ]);
  });

  it('gives the unit head assign/return/revise with unit-level labels', () => {
    const user = userOf('unit-head', UNIT);
    expect(idsFor(user)).toEqual([
      'view',
      'trail',
      'note',
      'assign',
      'forward',
      'revision',
    ]);
    expect(labelFor(user, 'assign')).toBe('Assign to Officer');
    expect(labelFor(user, 'forward')).toBe('Return to Dept. Head');
    expect(labelFor(user, 'revision')).toBe('Return to Officer');
  });

  it('gives the officer only the return-to-unit-head action', () => {
    const user = userOf('officer', UNIT);
    expect(idsFor(user)).toEqual(['view', 'trail', 'note', 'forward']);
    expect(labelFor(user, 'forward')).toBe('Return to Unit Head');
  });
});

describe('labels and messages', () => {
  it('titles the assign dialog after the actual target', () => {
    expect(assignDialogTitle(userOf('department-head'))).toBe(
      'Assign to Unit',
    );
    expect(assignDialogTitle(userOf('unit-head', UNIT))).toBe(
      'Assign to Officer',
    );
  });

  it('reports approval correctly for the EVC vs submitters', () => {
    expect(approveSuccessMessage({ role: 'evc' }, '12/234/A')).toBe(
      '12/234/A approved.',
    );
    expect(
      approveSuccessMessage(userOf('department-head'), '12/234/A'),
    ).toBe('12/234/A submitted to the EVC for approval.');
  });
});
