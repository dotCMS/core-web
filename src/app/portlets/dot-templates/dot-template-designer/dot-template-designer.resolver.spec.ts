import { TestBed } from '@angular/core/testing';

import { DotTemplateDesignerResolver } from './dot-template-designer.resolver';

describe('DotTemplateDesignerService', () => {
    let service: DotTemplateDesignerResolver;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DotTemplateDesignerResolver);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
