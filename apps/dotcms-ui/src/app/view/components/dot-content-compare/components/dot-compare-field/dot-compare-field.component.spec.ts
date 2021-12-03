import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotCompareFieldComponent } from './dot-compare-field.component';

describe('DotCompareFieldComponent', () => {
  let component: DotCompareFieldComponent;
  let fixture: ComponentFixture<DotCompareFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotCompareFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotCompareFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
