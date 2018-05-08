import { TestBed, inject } from '@angular/core/testing';

import { DotThemesService } from './dot-themes.service';

describe('DotThemesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DotThemesService]
    });
  });

  it('should be created', inject([DotThemesService], (service: DotThemesService) => {
    expect(service).toBeTruthy();
  }));
});
