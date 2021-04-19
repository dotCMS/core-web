import { TestBed } from '@angular/core/testing';

import { DotCDNService } from './dotcdn.service';

describe('DotcdnService', () => {
    let service: DotCDNService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DotCDNService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
