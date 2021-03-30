import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotImageContainerComponent } from './dot-image-container.component';

describe('DotImageContainerComponent', () => {
  let component: DotImageContainerComponent;
  let fixture: ComponentFixture<DotImageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotImageContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotImageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
