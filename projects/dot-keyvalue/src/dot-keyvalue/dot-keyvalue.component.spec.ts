import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotKeyvalueComponent } from './dot-keyvalue.component';

describe('DotKeyvalueComponent', () => {
  let component: DotKeyvalueComponent;
  let fixture: ComponentFixture<DotKeyvalueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotKeyvalueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotKeyvalueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
