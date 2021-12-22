import { TestBed } from '@angular/core/testing';

import { DotVersionableService } from './dot-versionable.service';

describe('DotVersionableService', () => {
  let service: DotVersionableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DotVersionableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
