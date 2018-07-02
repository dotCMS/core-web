import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotBaseTypeSelectorComponent } from './dot-base-type-selector.component';

describe('DotBaseTypeSelectorComponent', () => {
  let component: DotBaseTypeSelectorComponent;
  let fixture: ComponentFixture<DotBaseTypeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotBaseTypeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotBaseTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
