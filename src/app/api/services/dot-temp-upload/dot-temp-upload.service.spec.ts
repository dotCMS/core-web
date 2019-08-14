import { TestBed } from '@angular/core/testing';

import { DotTempUploadService } from './dot-temp-upload.service';

describe('DotTempUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DotTempUploadService = TestBed.get(DotTempUploadService);
    expect(service).toBeTruthy();
  });
});
