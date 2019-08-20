import { TestBed } from '@angular/core/testing';

import { DotActionService } from './dot-action.service';

describe('DotActionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DotActionService = TestBed.get(DotActionService);
    expect(service).toBeTruthy();
  });
});
