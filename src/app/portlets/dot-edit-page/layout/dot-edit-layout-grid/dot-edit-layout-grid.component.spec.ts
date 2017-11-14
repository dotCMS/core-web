import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotEditLayoutGridComponent } from './dot-edit-layout-grid.component';

describe('DotEditLayoutGridComponent', () => {
  let component: DotEditLayoutGridComponent;
  let fixture: ComponentFixture<DotEditLayoutGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotEditLayoutGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotEditLayoutGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
