import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeHolderComponent } from './iframe-holder.component';

describe('IframeHolderComponent', () => {
  let component: IframeHolderComponent;
  let fixture: ComponentFixture<IframeHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IframeHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
