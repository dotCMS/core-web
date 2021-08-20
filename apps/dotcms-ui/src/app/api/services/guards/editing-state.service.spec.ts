import { TestBed } from '@angular/core/testing';

import { EditingStateService } from './editing-state.service';

describe('EditingStateService', () => {
  let service: EditingStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditingStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
