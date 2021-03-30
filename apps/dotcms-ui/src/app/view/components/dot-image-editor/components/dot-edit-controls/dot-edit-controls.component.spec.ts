import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotEditControlsComponent } from './dot-edit-controls.component';

describe('DotEditControlsComponent', () => {
  let component: DotEditControlsComponent;
  let fixture: ComponentFixture<DotEditControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotEditControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotEditControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
