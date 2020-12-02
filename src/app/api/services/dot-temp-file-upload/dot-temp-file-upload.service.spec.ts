import { TestBed } from '@angular/core/testing';

import { DotTempFileUploadService } from './dot-temp-file-upload.service';

describe('DotTempFileUploadService', () => {
    let service: DotTempFileUploadService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DotTempFileUploadService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
