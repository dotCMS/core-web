import { TestBed, inject } from '@angular/core/testing';

import { DotSaveOnDeactivateServiceService } from './dot-save-on-deactivate-service.service';

describe('DotSaveOnDeactivateServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DotSaveOnDeactivateServiceService]
    });
  });

  it('should be created', inject([DotSaveOnDeactivateServiceService], (service: DotSaveOnDeactivateServiceService) => {
    expect(service).toBeTruthy();
  }));
});
