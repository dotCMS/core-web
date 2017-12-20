import { TestBed, inject } from '@angular/core/testing';

import { DotEditContentToolbarHtmlService } from './dot-edit-content-toolbar-html.service';

describe('DotEditContentToolbarHtmlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DotEditContentToolbarHtmlService]
    });
  });

  it('should be created', inject([DotEditContentToolbarHtmlService], (service: DotEditContentToolbarHtmlService) => {
    expect(service).toBeTruthy();
  }));
});
