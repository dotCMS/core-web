import { TestBed, inject } from '@angular/core/testing';

import { DotLayoutGridService } from './dot-layout-grid.service';

describe('DotLayoutGridService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DotLayoutGridService]
        });
    });

    it('should be created', inject([DotLayoutGridService], (service: DotLayoutGridService) => {
        expect(service).toBeTruthy();
    }));
});
