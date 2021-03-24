import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotGraphqlComponent } from './dot-graphql.component';

describe('DotGraphqlComponent', () => {
  let component: DotGraphqlComponent;
  let fixture: ComponentFixture<DotGraphqlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotGraphqlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotGraphqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
