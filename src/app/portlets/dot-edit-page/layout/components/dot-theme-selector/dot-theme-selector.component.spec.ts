import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotThemeSelectorComponent } from './dot-theme-selector.component';

describe('DotThemeSelectorComponent', () => {
  let component: DotThemeSelectorComponent;
  let fixture: ComponentFixture<DotThemeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotThemeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotThemeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
