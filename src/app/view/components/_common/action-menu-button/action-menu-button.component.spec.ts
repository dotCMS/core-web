import { ActionMenuButtonComponent } from './action-menu-button.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SplitButtonModule, MenuItem } from 'primeng/primeng';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ActionButtonComponent', () => {
    let comp: ActionMenuButtonComponent;
    let fixture: ComponentFixture<ActionMenuButtonComponent>;
    let de: DebugElement;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [ActionMenuButtonComponent],
            imports: [
                BrowserAnimationsModule,
                SplitButtonModule,
                RouterTestingModule.withRoutes([{
                    component: ActionMenuButtonComponent,
                    path: 'test'
                }])
            ]
        });

        fixture = TestBed.createComponent(ActionMenuButtonComponent);
        comp = fixture.componentInstance;
    }));

    it('should display an action button with opctions', () => {
        const fakeButtonItems: MenuItem[] = [{
            command: () => {},
            icon: 'fa-refresh',
            label: 'Update'
        },
        {
            command: () => {},
            icon: 'fa-close',
            label: 'Delete'
        },
        {
            icon: 'fa-link',
            label: 'Angular.io'
        },
        {
            icon: 'fa-paint-brush',
            label: 'Theming'
        }];
        comp.model = fakeButtonItems;
        fixture.detectChanges();
        de = fixture.debugElement.query(By.css('p-splitButton'));
        expect(de.nativeElement.className).toContain('multiple-options');
    });

    it('should display a primary action button', () => {
        comp.command = () => {};
        fixture.detectChanges();
        de = fixture.debugElement.query(By.css('p-splitButton'));
        expect(de.nativeElement.className).not.toContain('multiple-options');
    });

});
