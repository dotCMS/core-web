import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotEditLayoutComponent } from './dot-edit-layout.component';

describe('DotEditLayoutComponent', () => {
  let component: DotEditLayoutComponent;
  let fixture: ComponentFixture<DotEditLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotEditLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotEditLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
