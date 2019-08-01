import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotSpinnerComponent } from './dot-spinner.component';

describe('DotSpinnerComponent', () => {
  let component: DotSpinnerComponent;
  let fixture: ComponentFixture<DotSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
