import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotDownloadBundleDialogComponent } from './dot-download-bundle-dialog.component';

describe('DotDownloadBundleDialogComponent', () => {
  let component: DotDownloadBundleDialogComponent;
  let fixture: ComponentFixture<DotDownloadBundleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotDownloadBundleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotDownloadBundleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
