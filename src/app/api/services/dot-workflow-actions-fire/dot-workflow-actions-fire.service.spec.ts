import { TestBed } from '@angular/core/testing';

import { DotWorkflowActionsFireService } from './dot-workflow-actions-fire.service';

describe('DotActionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DotWorkflowActionsFireService = TestBed.get(DotWorkflowActionsFireService);
    expect(service).toBeTruthy();
  });
});
