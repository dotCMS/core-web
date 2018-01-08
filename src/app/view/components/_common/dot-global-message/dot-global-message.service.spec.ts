import { TestBed, inject } from '@angular/core/testing';

import { DotGlobalMessageService } from './dot-global-message.service';

describe('DotGlobalMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DotGlobalMessageService]
    });
  });

  it('should be created', inject([DotGlobalMessageService], (service: DotGlobalMessageService) => {
    expect(service).toBeTruthy();
  }));
});
