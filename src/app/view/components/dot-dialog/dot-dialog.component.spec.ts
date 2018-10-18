import { DebugElement, Component } from '@angular/core';
import { async, ComponentFixture } from '@angular/core/testing';

import { DOTTestBed } from '../../../test/dot-test-bed';
import { By } from '@angular/platform-browser';
import { DotDialogComponent, DotDialogActions } from './dot-dialog.component';
import { DotIconButtonModule } from '../_common/dot-icon-button/dot-icon-button.module';
import { DotIconButtonComponent } from '@components/_common/dot-icon-button/dot-icon-button.component';
import { ButtonModule } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const dispatchKeydownEvent = (key: string) => {
    const event = new KeyboardEvent('keydown', {
        'key': key,
        'code': key
    });

    document.dispatchEvent(event);
};

@Component({
    selector: 'dot-test-host-component',
    template: `
        <dot-dialog
            [actions]="actions"
            [headerStyle]="{'margin': '0'}"
            [contentStyle]="{'padding': '0'}"
            [header]="header"
            [(visible)]="show"
            [closeable]="closeable">
            <b>Dialog content</b>
        </dot-dialog>
    `
})
class TestHostComponent {
    header: string;
    show = false;
    closeable = false;
    actions: DotDialogActions;
}

fdescribe('DotDialogComponent', () => {
    let component: DotDialogComponent;
    let de: DebugElement;
    let hostComponent: TestHostComponent;
    let hostDe: DebugElement;
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            imports: [DotIconButtonModule, ButtonModule, BrowserAnimationsModule],
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

        it('should not show close button', () => {
            const close: DebugElement = de.query(By.css('dot-icon-button'));
            expect(close === null).toBe(true);
        });
    });

    describe('show', () => {
        let accceptAction: jasmine.Spy;
        let cancelAction: jasmine.Spy;

        beforeEach(() => {
            accceptAction = jasmine.createSpy('ok');
            cancelAction = jasmine.createSpy('cancel');

            hostComponent.closeable = true;
            hostComponent.header = 'Hello World';
            hostComponent.actions = {
                accept: {
                    label: 'Accept',
                    disabled: true,
                    action: accceptAction
                },
                cancel: {
                    label: 'Cancel',
                    disabled: false,
                    action: cancelAction
                }
            };
            hostComponent.show = true;

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

        it('should set the header custom styles', () => {
            const header: DebugElement = de.query(By.css('.dialog__header'));
            expect(header.styles).toEqual({margin: '0'});
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

        it('should set the content custom styles', () => {
            const content: DebugElement = de.query(By.css('.dialog__content'));
            expect(content.styles).toEqual({padding: '0'});
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

            const buttonsAttr = buttonsElements.map((button: HTMLButtonElement) => button.disabled);

            expect(buttonsComponents).toEqual(['Cancel', 'Accept']);
            expect(buttonsAttr).toEqual([false, true]);
        });

        describe('events', () => {
            beforeEach(() => {
                spyOn(component.hide, 'emit').and.callThrough();
                spyOn(component.visibleChange, 'emit').and.callThrough();
            });

            it('should close dialog and emit close', () => {
                hostFixture.whenStable().then(() => {
                    expect(component.visible).toBe(true);

                    const close: DebugElement = de.query(By.css('dot-icon-button'));

                    close.triggerEventHandler('click', {
                        preventDefault: () => {}
                    });

                    hostFixture.detectChanges();
                    expect(component.visibleChange.emit).toHaveBeenCalledTimes(1);
                    expect(component.visible).toBe(false);
                    // expect(component.hide.emit).toHaveBeenCalledTimes(1);
                });
            });

            it('should close the dialog on overlay click', () => {
                hostFixture.whenStable().then(() => {
                    de.nativeElement.click();
                    hostFixture.detectChanges();

                    expect(component.visible).toBe(false);
                });
            });

            xit('it should set shadow to header and footer on scroll', () => {

            });

            describe('keyboard events', () => {

                it('should trigger cancel action and close the dialog on Escape', () => {
                    hostFixture.whenStable().then(() => {
                        expect(component.visible).toBe(true);

                        dispatchKeydownEvent('Escape');

                        hostFixture.detectChanges();

                        expect(cancelAction).toHaveBeenCalledTimes(1);
                        expect(component.visible).toBe(false);
                        // expect(component.hide.emit).toHaveBeenCalledTimes(1);
                    });
                });

                it('should trigger accept action on Enter', () => {
                    hostComponent.actions = {
                        ...hostComponent.actions,
                        accept: {
                            ...hostComponent.actions.accept,
                            disabled: false
                        }
                    };

                    hostFixture.detectChanges();

                    hostFixture.whenStable().then(() => {
                        expect(component.visible).toBe(true);

                        dispatchKeydownEvent('Enter');

                        hostFixture.detectChanges();

                        expect(accceptAction).toHaveBeenCalledTimes(1);
                    });
                });
            });

            describe('actions', () => {
                it('should call accept action', () => {
                    hostComponent.actions = {
                        ...hostComponent.actions,
                        accept: {
                            ...hostComponent.actions.accept,
                            disabled: false
                        }
                    };
                    hostFixture.detectChanges();

                    const accept: DebugElement = de.query(By.css('.dialog__button-accept'));
                    accept.triggerEventHandler('click', {});

                    expect(accceptAction).toHaveBeenCalledTimes(1);
                });

                it('should call cancel action and close the dialog', () => {
                    hostFixture.whenStable().then(() => {
                        expect(component.visible).toBe(true);

                        const cancel: DebugElement = de.query(By.css('.dialog__button-cancel'));
                        cancel.triggerEventHandler('click', {});

                        hostFixture.detectChanges();

                        expect(cancelAction).toHaveBeenCalledTimes(1);
                        expect(component.visible).toBe(false);
                        // expect(component.hide.emit).toHaveBeenCalledTimes(1);
                    });
                });
            });
        });
    });
});
