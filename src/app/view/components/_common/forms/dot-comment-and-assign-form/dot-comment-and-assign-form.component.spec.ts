import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotCommentAndAssignFormComponent } from './dot-comment-and-assign-form.component';

describe('DotAssigneeFormComponent', () => {
  let component: DotCommentAndAssignFormComponent;
  let fixture: ComponentFixture<DotCommentAndAssignFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotCommentAndAssignFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotCommentAndAssignFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
