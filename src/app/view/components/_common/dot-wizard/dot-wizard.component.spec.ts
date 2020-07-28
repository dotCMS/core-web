import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotWizardComponent } from './dot-wizard.component';

describe('DotWizardComponent', () => {
  let component: DotWizardComponent;
  let fixture: ComponentFixture<DotWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
