import { TestBed, inject } from '@angular/core/testing';

import { MenuGuardService } from './menu-guard.service';

describe('ValidMenuGuardService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MenuGuardService]
        });
    });
    it('should be created', inject([MenuGuardService], (service: MenuGuardService) => {
        expect(service).toBeTruthy();
    }));
});
