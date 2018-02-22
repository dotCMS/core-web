import { TestBed, inject } from '@angular/core/testing';

import { DotLanguagesService } from './dot-languages.service';

describe('DotLanguagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DotLanguagesService]
    });
  });

  it('should be created', inject([DotLanguagesService], (service: DotLanguagesService) => {
    expect(service).toBeTruthy();
  }));
});
