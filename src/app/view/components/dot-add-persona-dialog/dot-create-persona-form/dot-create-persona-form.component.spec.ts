import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotCreatePersonaFormComponent } from './dot-create-persona-form.component';

describe('DotCreatePersonaFormComponent', () => {
  let component: DotCreatePersonaFormComponent;
  let fixture: ComponentFixture<DotCreatePersonaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotCreatePersonaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotCreatePersonaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
