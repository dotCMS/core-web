import { TestBed } from '@angular/core/testing';
import { DotDownloadBundleDialogService } from './dot-download-bundle-dialog.service';

describe('DotDownloadBundleDialogService', () => {
    let service: DotDownloadBundleDialogService;
    let bundleID: string;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.get(DotDownloadBundleDialogService);
        service.showDialog$.subscribe((data: string) => (bundleID = data));
    });

    it('should be created', () => {
        service.open('ZXC!2');
        expect(bundleID).toEqual('ZXC!2');
    });
});
