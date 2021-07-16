import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotMdIconSelectorComponent } from './dot-md-icon-selector.component';

describe('DotMdIconSelectorComponent', () => {
  let component: DotMdIconSelectorComponent;
  let fixture: ComponentFixture<DotMdIconSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotMdIconSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotMdIconSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
