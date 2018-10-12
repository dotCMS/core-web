import { DebugElement, Component } from '@angular/core';
import { async, ComponentFixture } from '@angular/core/testing';

import { DOTTestBed } from '../../../test/dot-test-bed';
import { By } from '@angular/platform-browser';
import { DotDialogComponent, DotDialogAction } from './dot-dialog.component';
import { DotIconButtonModule } from '../_common/dot-icon-button/dot-icon-button.module';
import { DotIconButtonComponent } from '@components/_common/dot-icon-button/dot-icon-button.component';
import { ButtonModule } from 'primeng/primeng';

@Component({
    selector: 'dot-test-host-component',
    template: `
        <dot-dialog [header]="header" [show]="show" [ok]="ok" [cancel]="cancel">
            <b>Dialog content</b>
        </dot-dialog>`
})
class TestHostComponent {
    header: string;
    show = false;

    ok: DotDialogAction;
    cancel: DotDialogAction;
}

describe('DotDialogComponent', () => {
    let component: DotDialogComponent;
    let de: DebugElement;
    let hostComponent: TestHostComponent;
    let hostDe: DebugElement;
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            imports: [DotIconButtonModule, ButtonModule],
            providers: [],
            declarations: [DotDialogComponent, TestHostComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        hostFixture = DOTTestBed.createComponent(TestHostComponent);
        hostDe = hostFixture.debugElement;
        hostComponent = hostFixture.componentInstance;
    });

    describe('default', () => {
        beforeEach(() => {
            hostFixture.detectChanges();
            de = hostDe.query(By.css('dot-dialog'));
            component = de.componentInstance;
        });

        it('should not show dialog', () => {
            expect(de.nativeElement.classList.contains('active')).toBe(false);
        });

        it('should not show footer buttons', () => {
            const footer = de.query(By.css('.dialog__footer'));
            expect(footer === null).toBe(true);
        });
    });

    describe('show', () => {
        const okAction = jasmine.createSpy('ok');
        const cancelAction = jasmine.createSpy('cancel');

        beforeEach(() => {
            hostComponent.show = true;
            hostComponent.header = 'Hello World';
            hostComponent.ok = {
                label: 'Accept',
                disabled: true,
                action: okAction
            };

            hostComponent.cancel = {
                label: 'Cancel',
                disabled: false,
                action: cancelAction
            };

            hostFixture.detectChanges();
            de = hostDe.query(By.css('dot-dialog'));
            component = de.componentInstance;
        });

        it('should show dialog', () => {
            expect(de.nativeElement.classList.contains('active')).toBe(true);
        });

        it('should set the header', () => {
            const header: DebugElement = de.query(By.css('.dialog__header h4'));
            expect(header.nativeElement.textContent).toBe('Hello World');
        });

        it('should have close button', () => {
            const close: DebugElement = de.query(By.css('dot-icon-button'));
            const closeComponent: DotIconButtonComponent = close.componentInstance;

            expect(closeComponent.icon).toBe('close');
            expect(close.attributes.big).toBeDefined();
        });

        it('should show content', () => {
            const content: DebugElement = de.query(By.css('.dialog__content'));
            expect(content.nativeElement.innerHTML).toBe('<b>Dialog content</b>');
        });

        it('should show footer', () => {
            const footer: DebugElement = de.query(By.css('.dialog__footer'));
            expect(footer === null).toBe(false);
        });

        it('should show action buttons', () => {
            const buttons: DebugElement[] = de.queryAll(By.css('.dialog__footer button'));

            const buttonsElements = buttons.map((button: DebugElement) => button.nativeElement);

            const buttonsComponents = buttonsElements.map(
                (button: HTMLButtonElement) => button.textContent
            );

            const buttonsAttr = buttonsElements.map(
                (button: HTMLButtonElement) => button.disabled
            );

            expect(buttonsComponents).toEqual(['Cancel', 'Accept']);
            expect(buttonsAttr).toEqual([false, true]);
        });

        xit('should add shadow to header and footer on content scroll');

        describe('events', () => {
            beforeEach(() => {
                spyOn(component.close, 'emit');
            });

            it('should close dialog and emit close', () => {
                const close: DebugElement = de.query(By.css('dot-icon-button'));

                expect(component.show).toBe(true);

                close.triggerEventHandler('click', {});

                expect(component.show).toBe(false);
                expect(component.close.emit).toHaveBeenCalledTimes(1);
            });

            it('shoudl call ok action', () => {
                const ok: DebugElement = de.query(By.css('.dialog__button-ok'));
                ok.triggerEventHandler('click', {});

                expect(okAction).toHaveBeenCalledTimes(1);
            });

            it('should call cancel action and close the dialog', () => {
                const cancel: DebugElement = de.query(By.css('.dialog__button-cancel'));
                cancel.triggerEventHandler('click', {});

                expect(cancelAction).toHaveBeenCalledTimes(1);
                expect(component.show).toBe(false);
                expect(component.close.emit).toHaveBeenCalledTimes(1);
            });
        });
    });
});
