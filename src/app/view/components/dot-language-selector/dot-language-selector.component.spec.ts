import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotLanguageSelectorComponent } from './dot-language-selector.component';

describe('DotLanguageSelectorComponent', () => {
  let component: DotLanguageSelectorComponent;
  let fixture: ComponentFixture<DotLanguageSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotLanguageSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotLanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
