import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotLayoutComponent } from './dot-layout.component';

describe('DotLayoutComponent', () => {
  let component: DotLayoutComponent;
  let fixture: ComponentFixture<DotLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
