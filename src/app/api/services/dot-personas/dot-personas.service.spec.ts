import { TestBed, inject } from '@angular/core/testing';

import { DotPersonasService } from './dot-personas.service';

describe('DotPersonasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DotPersonasService]
    });
  });

  it('should be created', inject([DotPersonasService], (service: DotPersonasService) => {
    expect(service).toBeTruthy();
  }));
});
