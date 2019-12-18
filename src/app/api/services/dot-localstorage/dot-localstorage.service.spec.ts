import { TestBed } from '@angular/core/testing';

import { DotLocalstorageService } from './dot-localstorage.service';

describe('DotLocalstorageService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DotLocalstorageService = TestBed.get(DotLocalstorageService);
        expect(service).toBeTruthy();
    });
});
