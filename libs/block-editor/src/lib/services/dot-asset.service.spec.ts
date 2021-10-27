import { TestBed } from '@angular/core/testing';

import { DotAssetService } from './dot-asset.service';

describe('DotAssetService', () => {
  let service: DotAssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DotAssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
