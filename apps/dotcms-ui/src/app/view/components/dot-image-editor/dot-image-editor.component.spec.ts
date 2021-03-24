import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotImageEditorComponent } from './dot-image-editor.component';

describe('DotImageEditorComponent', () => {
  let component: DotImageEditorComponent;
  let fixture: ComponentFixture<DotImageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotImageEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotImageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
