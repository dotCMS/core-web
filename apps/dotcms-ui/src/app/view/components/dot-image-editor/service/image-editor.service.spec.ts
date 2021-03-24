import { TestBed } from '@angular/core/testing';

import { ImageEditorService } from './image-editor.service';

describe('ImageEditorService', () => {
  let service: ImageEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
