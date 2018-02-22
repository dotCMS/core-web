import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotEditContentViewAsToolbarComponent } from './dot-edit-content-view-as-toolbar.component';

describe('DotEditContentViewAsToolbarComponent', () => {
  let component: DotEditContentViewAsToolbarComponent;
  let fixture: ComponentFixture<DotEditContentViewAsToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotEditContentViewAsToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotEditContentViewAsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
