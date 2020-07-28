import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotCommentFormComponent } from './dot-comment-form.component';

describe('DotCommentFormComponent', () => {
  let component: DotCommentFormComponent;
  let fixture: ComponentFixture<DotCommentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotCommentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotCommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
