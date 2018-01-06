import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotMessageWrapperComponent } from './dot-message-wrapper.component';

describe('DotMessageWrapperComponent', () => {
  let component: DotMessageWrapperComponent;
  let fixture: ComponentFixture<DotMessageWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotMessageWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotMessageWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
