import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotDeviceSelectorComponent } from './dot-device-selector.component';

describe('DotDeviceSelectorComponent', () => {
  let component: DotDeviceSelectorComponent;
  let fixture: ComponentFixture<DotDeviceSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotDeviceSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotDeviceSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
