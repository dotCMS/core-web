import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotKeyvalueItemComponent } from './dot-keyvalue-item.component';

describe('DotKeyvalueItemComponent', () => {
  let component: DotKeyvalueItemComponent;
  let fixture: ComponentFixture<DotKeyvalueItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotKeyvalueItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotKeyvalueItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
