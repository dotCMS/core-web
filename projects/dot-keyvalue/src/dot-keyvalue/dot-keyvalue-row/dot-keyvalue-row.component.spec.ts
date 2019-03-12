import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotKeyvalueRowComponent } from './dot-keyvalue-row.component';

describe('DotKeyvalueRowComponent', () => {
  let component: DotKeyvalueRowComponent;
  let fixture: ComponentFixture<DotKeyvalueRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotKeyvalueRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotKeyvalueRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
