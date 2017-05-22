import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { SplitButtonModule, ButtonModule } from 'primeng/primeng';

import { ActionHeaderComponent } from './action-header';


class RouterMock {
    navigate(): string {
        return null;
    }
}

fdescribe('ActionHeaderComponent (inline template)', () => {

    let comp: ActionHeaderComponent;
    let fixture: ComponentFixture<ActionHeaderComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SplitButtonModule, ButtonModule],
            // tslint:disable-next-line:object-literal-sort-keys
            declarations: [ActionHeaderComponent],
            providers: [{ provide: Router, useClass: RouterMock }]
        });

        fixture = TestBed.createComponent(ActionHeaderComponent);

        comp = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('div'));
        el = de.nativeElement;

    }));

    it('should render default state correctly', () => {
        let actionButton = de.query(By.css('button'));
        let globalSearch  = de.query(By.css('input'));
        let groupActions = de.query(By.css('.action-header__group-actions'));

        expect(actionButton).not.toBeNull();
        expect(globalSearch).not.toBeNull();
        expect(groupActions).not.toBeNull();
    });

    it('should show the number of items selected', () => {
        let fakeData = [{key: 'value'}, {key: 'value'}];
        let items = 2;
        let selectedItemsCounter = de.query(By.css('.action-header__selected-items-counter'));

        comp.selectedItems = fakeData;
        comp.selected = true;
        fixture.detectChanges();

        expect(selectedItemsCounter.nativeElement.textContent).toBe(items + ' Selected');
    });

    it('should trigger the action button method', () => {
        let actionButton = de.query(By.css('button'));
        let btnAction;

        btnAction = jasmine.createSpy('actionBtnCommand');
        comp.primaryCommand = btnAction('actionBtnCommand');

        fixture.detectChanges();

        actionButton.triggerEventHandler('click', null);

        expect(btnAction).toHaveBeenCalled();

    });

    it('should trigger the methods in the action buttons', () => {
        let groupActions = de.query(By.css('.action-header__group-actions'));
        let firstSpy = jasmine.createSpy('firstSpy');
        let secondSpy = jasmine.createSpy('secondSpy');

        let fakeData = [
            {
                label: 'Group Actions',
                model: [
                    {label: 'Update', icon: 'fa-refresh', command: firstSpy}
                ]
            },
            {
                label: 'Edit Content',
                model: [
                    {label: 'Publish', icon: 'fa-refresh', command: secondSpy}
                ]
            }
        ];

        comp.actionButtonItems = fakeData;
        comp.selected = true;
        fixture.detectChanges();

        let primaryButton = groupActions.query(By.css('.actions .ui-menuitem'));
        let secondButton = groupActions.query(By.css('.edit .ui-menuitem'));

        primaryButton.triggerEventHandler('click', null);
        secondButton.triggerEventHandler('click', null);

        expect(firstSpy).toHaveBeenCalled();
        expect(secondSpy).toHaveBeenCalled();
    });
});