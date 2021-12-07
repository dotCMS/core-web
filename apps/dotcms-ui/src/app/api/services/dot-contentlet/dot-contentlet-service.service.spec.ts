import { TestBed } from '@angular/core/testing';

import { DotContentletService } from './dot-contentlet.service';

describe('DotContentletService', () => {
    let service: DotContentletService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DotContentletService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
