import { TestBed } from '@angular/core/testing';

import { DotWorkflowEventHandlerService } from './dot-workflow-event-handler.service';

describe('DotWorkflowEventHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DotWorkflowEventHandlerService = TestBed.get(DotWorkflowEventHandlerService);
    expect(service).toBeTruthy();
  });
});
