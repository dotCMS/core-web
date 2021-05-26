import { TestBed } from '@angular/core/testing';

import { DotNavLogoService } from './dot-nav-logo.service';

describe('DotNavLogoService', () => {
    let service: DotNavLogoService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DotNavLogoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
