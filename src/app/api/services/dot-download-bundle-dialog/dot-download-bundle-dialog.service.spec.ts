import { TestBed } from '@angular/core/testing';

import { DotDownloadBundleDialogService } from './dot-download-bundle-dialog.service';

describe('DotDownloadBundleDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DotDownloadBundleDialogService = TestBed.get(DotDownloadBundleDialogService);
    expect(service).toBeTruthy();
  });
});
