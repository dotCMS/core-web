import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotOverlayMaskComponent } from './dot-overlay-mask.component';

describe('DotOverlayMaskComponent', () => {
  let component: DotOverlayMaskComponent;
  let fixture: ComponentFixture<DotOverlayMaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotOverlayMaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotOverlayMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
