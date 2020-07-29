import { TestBed } from '@angular/core/testing';

import { DotWizardService } from './dot-wizard.service';

describe('DotWizardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DotWizardService = TestBed.get(DotWizardService);
    expect(service).toBeTruthy();
  });
});
