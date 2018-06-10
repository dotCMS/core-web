import { inject } from '@angular/core/testing';
import { DotPageSelectorService } from './dot-page-selector.service';
import { DOTTestBed } from '../../../../../test/dot-test-bed';

describe('Service: DotPageSelector', () => {
    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            providers: [DotPageSelectorService]
        });
    });

    it('should ...', inject([DotPageSelectorService], (service: DotPageSelectorService) => {
        expect(service).toBeTruthy();
    }));
});
