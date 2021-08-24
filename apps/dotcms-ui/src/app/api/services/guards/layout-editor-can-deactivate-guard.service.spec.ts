import { TestBed } from '@angular/core/testing';

import { LayoutEditorCanDeactivateGuardService } from './layout-editor-can-deactivate-guard.service';

describe('LayoutEditorCanDeactivateGuardService', () => {
  let service: LayoutEditorCanDeactivateGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutEditorCanDeactivateGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
