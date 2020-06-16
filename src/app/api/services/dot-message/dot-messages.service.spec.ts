import { TestBed } from '@angular/core/testing';

import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { CoreWebService } from 'dotcms-js';
import { FormatDateService } from '@services/format-date-service';

describe('DotMessageService', () => {
    let service: DotMessageService;
    let coreWebService: CoreWebService;
    let formatDateService: FormatDateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.get(DotMessageService);
        coreWebService = TestBed.get(CoreWebService);
        formatDateService = TestBed.get(FormatDateService);
    });

    describe('setItem', () => {});

    describe('removeItem', () => {
        beforeEach(() => {
            spyOn(window.localStorage, 'removeItem');
        });

        it('should remove', () => {
            service.removeItem('hello');
            expect(window.localStorage.removeItem).toHaveBeenCalledWith('hello');
        });
    });
});
