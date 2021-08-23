import { TestBed } from '@angular/core/testing';

import { CanDesactiveGuardService } from './can-deactivate-guard.service';

describe('CanDesactiveGuardService', () => {
  let service: CanDesactiveGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanDesactiveGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
