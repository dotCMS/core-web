import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotMenuComponent } from './dot-menu.component';

describe('DotMenuComponent', () => {
  let component: DotMenuComponent;
  let fixture: ComponentFixture<DotMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
