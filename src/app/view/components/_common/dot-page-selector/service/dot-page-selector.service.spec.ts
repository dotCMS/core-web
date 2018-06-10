import { TestBed, async, inject } from '@angular/core/testing';
import { DotPageSelectorService } from './dot-page-selector.service';

describe('Service: DotPageSelector', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DotPageSelectorService]
        });
    });

    it('should ...', inject([DotPageSelectorService], (service: DotPageSelectorService) => {
        expect(service).toBeTruthy();
    }));
});
