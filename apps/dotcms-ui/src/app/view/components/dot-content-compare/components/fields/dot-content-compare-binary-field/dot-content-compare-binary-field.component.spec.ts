import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotContentCompareBinaryFieldComponent } from './dot-content-compare-binary-field.component';

describe('DotContentCompareBinaryFieldComponent', () => {
  let component: DotContentCompareBinaryFieldComponent;
  let fixture: ComponentFixture<DotContentCompareBinaryFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotContentCompareBinaryFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotContentCompareBinaryFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
