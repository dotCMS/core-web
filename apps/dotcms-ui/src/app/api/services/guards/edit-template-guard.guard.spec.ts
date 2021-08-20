import { TestBed } from '@angular/core/testing';

import { EditTemplateGuardGuard } from './edit-template-guard.guard';

describe('EditTemplateGuardGuard', () => {
  let guard: EditTemplateGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EditTemplateGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
