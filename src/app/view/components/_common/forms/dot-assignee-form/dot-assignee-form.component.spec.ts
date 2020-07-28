import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotAssigneeFormComponent } from './dot-assignee-form.component';

describe('DotAssigneeFormComponent', () => {
  let component: DotAssigneeFormComponent;
  let fixture: ComponentFixture<DotAssigneeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotAssigneeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotAssigneeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
