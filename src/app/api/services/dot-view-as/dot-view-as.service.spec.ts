import { TestBed, inject } from '@angular/core/testing';

import { DotViewAsService } from './dot-view-as.service';

describe('DotViewAsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DotViewAsService]
    });
  });

  it('should be created', inject([DotViewAsService], (service: DotViewAsService) => {
    expect(service).toBeTruthy();
  }));
});
