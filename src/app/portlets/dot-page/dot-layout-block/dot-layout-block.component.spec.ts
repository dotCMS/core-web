import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotLayoutBlockComponent } from './dot-layout-block.component';

describe('DotLayoutBlockComponent', () => {
  let component: DotLayoutBlockComponent;
  let fixture: ComponentFixture<DotLayoutBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotLayoutBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotLayoutBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
