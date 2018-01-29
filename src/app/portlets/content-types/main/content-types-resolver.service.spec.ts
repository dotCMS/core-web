import { TestBed, inject } from '@angular/core/testing';

import { ContentTypesResolverService } from './content-types-resolver.service';

describe('ContentTypesResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentTypesResolverService]
    });
  });

  it('should be created', inject([ContentTypesResolverService], (service: ContentTypesResolverService) => {
    expect(service).toBeTruthy();
  }));
});
