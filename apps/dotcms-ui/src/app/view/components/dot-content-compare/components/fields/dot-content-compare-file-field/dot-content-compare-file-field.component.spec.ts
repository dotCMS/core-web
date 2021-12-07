import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotContentCompareFileFieldComponent } from './dot-content-compare-file-field.component';

describe('DotContentCompareFileFieldComponent', () => {
  let component: DotContentCompareFileFieldComponent;
  let fixture: ComponentFixture<DotContentCompareFileFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotContentCompareFileFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotContentCompareFileFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
