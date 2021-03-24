import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DotGraphqlComponent } from './dot-graphql.component';
import * as graphql from 'graphql-playground-html';

describe('DotGraphqlComponent', () => {
    let component: DotGraphqlComponent;
    let fixture: ComponentFixture<DotGraphqlComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotGraphqlComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotGraphqlComponent);
        component = fixture.componentInstance;
        spyOn(graphql, 'renderPlaygroundPage').and.returnValue('markup');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(graphql.renderPlaygroundPage).toHaveBeenCalledWith({ endpoint: '/api/v1/graphql' });
        expect(component.iframe.nativeElement.contentDocument.body.innerText).toEqual('markup');
    });
});
