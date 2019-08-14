import { TestBed } from '@angular/core/testing';

import { DotContentService } from './dot-content.service';

describe('DotContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DotContentService = TestBed.get(DotContentService);
    expect(service).toBeTruthy();
  });
});
