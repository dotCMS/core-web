import { TestBed } from '@angular/core/testing';

import { LoginPageStateService } from './login-page-state.service';

describe('LoginPAgeStateServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginPageStateService = TestBed.get(LoginPageStateService);
    expect(service).toBeTruthy();
  });
});
