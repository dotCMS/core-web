import { TestBed } from '@angular/core/testing';

import { DotWorkflowsActionsSelectorFieldService } from './dot-workflows-actions-selector-field.service';

describe('DotWorkflowsActionsSelectorFieldService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DotWorkflowsActionsSelectorFieldService = TestBed.get(
            DotWorkflowsActionsSelectorFieldService
        );
        expect(service).toBeTruthy();
    });
});
