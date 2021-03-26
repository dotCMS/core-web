import { TestBed } from '@angular/core/testing';

import { StoreImageService } from './store-image.service';

describe('StoreImageService', () => {
  let service: StoreImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
