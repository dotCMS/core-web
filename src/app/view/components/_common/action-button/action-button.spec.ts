import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { SplitButtonModule, ButtonModule } from 'primeng/primeng';
import { ActionButtonComponent } from './action-button';
import { DOTTestBed } from '../../../../test/dot-test-bed';

class RouterMock {
    navigate(): string {
        return null;
    }
}

fdescribe('ActionButtonComponent (inline template)', () => {
    let comp: ActionButtonComponent;
    let fixture: ComponentFixture<ActionButtonComponent>;
    let de: DebugElement;
    let fakeButtonItems = [{
        command: () => {
            console.log('action update');
        },
        icon: 'fa-refresh',
        label: 'Update'
    },
    {
        command: () => {
            console.log('action delete');
        },
        icon: 'fa-close',
        label: 'Delete'
    },
    {
        icon: 'fa-link',
        label: 'Angular.io',
        url: 'http://angular.io'
    },
    {
        icon: 'fa-paint-brush',
        label: 'Theming',
        routerLink: ['/theming']
    }];

    beforeEach(async(() => {

        DOTTestBed.configureTestingModule({
            declarations: [ActionButtonComponent],
            imports: [SplitButtonModule, ButtonModule],
            providers: [
                { provide: Router, useClass: RouterMock }
            ]
        });

        fixture = TestBed.createComponent(ActionButtonComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement.query(By.css('div'));

    }));

    it('should display an action button with opctions', () => {
        comp.primaryAction = null;
        comp.options = fakeButtonItems;
        fixture.detectChanges();
        expect(comp.multipleOptions).toBe(true);
    });

    it('should display a primary action button', () => {
        comp.primaryAction = Function;
        comp.options = null;
        fixture.detectChanges();
        expect(comp.multipleOptions).toBe(false);
        expect(comp.primaryAction).toBe(Function);
    });

});