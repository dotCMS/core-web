import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotAddPersonaDialogComponent } from './dot-add-persona-dialog.component';

describe('DotAddPersonaDialogComponent', () => {
  let component: DotAddPersonaDialogComponent;
  let fixture: ComponentFixture<DotAddPersonaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotAddPersonaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotAddPersonaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
