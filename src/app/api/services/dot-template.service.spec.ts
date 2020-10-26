import { TestBed } from '@angular/core/testing';

import { DotTemplateService } from './dot-template.service';

describe('DotTemplateService', () => {
    let service: DotTemplateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DotTemplateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
