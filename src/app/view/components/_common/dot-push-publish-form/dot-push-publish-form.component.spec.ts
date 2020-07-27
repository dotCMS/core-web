import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotPushPublishFormComponent } from './dot-push-publish-form.component';

describe('DotPushPublishFormComponent', () => {
  let component: DotPushPublishFormComponent;
  let fixture: ComponentFixture<DotPushPublishFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotPushPublishFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotPushPublishFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
