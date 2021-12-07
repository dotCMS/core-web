import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotContentCompareDateFieldComponent } from './dot-content-compare-date-field.component';

describe('DotContentCompareDateFieldComponent', () => {
  let component: DotContentCompareDateFieldComponent;
  let fixture: ComponentFixture<DotContentCompareDateFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotContentCompareDateFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotContentCompareDateFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
