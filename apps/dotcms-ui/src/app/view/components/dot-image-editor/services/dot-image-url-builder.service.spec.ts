import { TestBed } from '@angular/core/testing';

import { DotImageUrlBuilder } from './dot-image-url-builder.service';

describe('DotImageUrlBuilder', () => {
  let service: DotImageUrlBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DotImageUrlBuilder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
