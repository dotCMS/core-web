import { TestBed } from '@angular/core/testing';

import { UrlValidatorService } from './url-validator.service';

describe('UrlValidatorService', () => {
  let service: UrlValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
