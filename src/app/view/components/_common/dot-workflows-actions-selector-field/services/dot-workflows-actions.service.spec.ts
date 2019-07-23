import { TestBed } from '@angular/core/testing';

import { DotWorkflowsActionsService } from './dot-workflows-actions.service';

describe('DotWorkflowsActionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DotWorkflowsActionsService = TestBed.get(DotWorkflowsActionsService);
    expect(service).toBeTruthy();
  });
});
