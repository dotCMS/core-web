import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotGlobalMessageComponent } from './dot-global-message.component';

describe('DotGlobalMessageComponent', () => {
  let component: DotGlobalMessageComponent;
  let fixture: ComponentFixture<DotGlobalMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotGlobalMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotGlobalMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
