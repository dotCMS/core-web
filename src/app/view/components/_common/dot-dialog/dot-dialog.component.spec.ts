import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DotDialogService } from '../../../../api/services/dot-dialog/dot-dialog.service';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { LoginServiceMock } from '../../../../test/login-service.mock';
import { LoginService } from 'dotcms-js/dotcms-js';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DotDialogComponent } from './dot-dialog.component';
import { async, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { tick } from '@angular/core/testing';

describe('DotDialogComponent', () => {
    let component: DotDialogComponent;
    let dialogService: DotDialogService;
    let fixture: ComponentFixture<DotDialogComponent>;
    let de: DebugElement;

    beforeEach(
        async(() => {
            DOTTestBed.configureTestingModule({
                declarations: [DotDialogComponent],
                providers: [
                    {
                        provide: LoginService,
                        useClass: LoginServiceMock
                    },
                    DotDialogService
                ],
                imports: [BrowserAnimationsModule]
            });

            fixture = DOTTestBed.createComponent(DotDialogComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            dialogService = de.injector.get(DotDialogService);
            fixture.detectChanges();
        })
    );

    it('should have confirm and dialog null by default', () => {
        const confirm = de.query(By.css('p-confirmDialog'));
        const alert = de.query(By.css('p-dialog'));
        expect(confirm === null).toBe(true);
        expect(alert === null).toBe(true);
    });

    describe('confirmation dialog', () => {
        it('should show', () => {
            dialogService.confirm({
                header: '',
                message: ''
            });

            fixture.detectChanges();
            const confirm = de.query(By.css('p-confirmDialog'));
            expect(confirm === null).toBe(false);
        });

        it('should have right attrs', () => {
            dialogService.confirm({
                header: '',
                message: ''
            });

            fixture.detectChanges();
            const confirm = de.query(By.css('p-confirmDialog')).componentInstance;
            expect(confirm.responsive).toBe(true, 'responsive');
            expect(confirm.width).toBe('400', 'width');
            expect(confirm.closable).toBe(false, 'closable');
        });

        it(
            'should bind correctly to buttons',
            fakeAsync(() => {
                spyOn(component, 'onClickConfirm');

                dialogService.confirm({
                    header: '',
                    message: ''
                });

                fixture.detectChanges(); // ngIf
                tick();
                fixture.detectChanges(); // confirmation service make it happen

                const buttons = de.queryAll(By.css('p-confirmDialog button'));
                buttons[0].nativeElement.click();
                expect(component.onClickConfirm).toHaveBeenCalledTimes(1);

                buttons[1].nativeElement.click();
                expect(component.onClickConfirm).toHaveBeenCalledTimes(2);
            })
        );

        it(
            'should handle accept click correctly',
            fakeAsync(() => {
                spyOn(dialogService, 'clearConfirm');

                const model = {
                    header: '',
                    message: '',
                    accept: jasmine.createSpy('accept'),
                    reject: jasmine.createSpy('reject')
                };
                dialogService.confirm(model);

                fixture.detectChanges(); // ngIf
                tick();
                fixture.detectChanges(); // confirmation service make it happen

                component.onClickConfirm('accept');

                expect(dialogService.clearConfirm).toHaveBeenCalledTimes(1);
                expect(model.accept).toHaveBeenCalledTimes(1);
            })
        );

        it(
            'should handle reject click correctly',
            fakeAsync(() => {
                spyOn(dialogService, 'clearConfirm');

                const model = {
                    header: '',
                    message: '',
                    accept: jasmine.createSpy('accept'),
                    reject: jasmine.createSpy('reject')
                };
                dialogService.confirm(model);

                fixture.detectChanges(); // ngIf
                tick();
                fixture.detectChanges(); // confirmation service make it happen

                component.onClickConfirm('reject');

                expect(dialogService.clearConfirm).toHaveBeenCalledTimes(1);
                expect(model.reject).toHaveBeenCalledTimes(1);
            })
        );
    });

    describe('alert dialog', () => {
        it('should show', () => {
            dialogService.alert({
                header: '',
                message: ''
            });

            fixture.detectChanges();
            const confirm = de.query(By.css('p-dialog'));
            expect(confirm === null).toBe(false);
        });

        it('should have right attrs', () => {
            dialogService.alert({
                header: 'Header Test',
                message: ''
            });

            fixture.detectChanges();
            const dialog = de.query(By.css('p-dialog')).componentInstance;

            expect(dialog.closable).toBe(false, 'closable');
            expect(dialog.header).toBe('Header Test', 'header');
            expect(dialog.modal).toBe('modal', 'modal');
            expect(dialog.responsive).toBe(true, 'responsive');
            expect(dialog.visible).toBe(true, 'visible');
            expect(dialog.width).toBe('400', 'width');
        });

        it('should add message', () => {
            dialogService.alert({
                header: 'Header Test',
                message: 'Hello world message'
            });

            fixture.detectChanges();
            const message = de.query(By.css('.ui-dialog-content p'));
            expect(message.nativeElement.textContent).toEqual('Hello world message');
        });

        it('should show only accept button', () => {
            dialogService.alert({
                header: '',
                message: ''
            });

            fixture.detectChanges();

            const buttons = de.queryAll(By.css('p-dialog button'));
            expect(buttons.length).toBe(1);
        });

        it('should show only accept and reject buttons', () => {
            dialogService.alert({
                header: '',
                message: '',
                footerLabel: {
                    accept: 'accept',
                    reject: 'accept'
                }
            });

            fixture.detectChanges();

            const buttons = de.queryAll(By.css('p-dialog button'));
            expect(buttons.length).toBe(2);
        });


        it('should bind accept and reject button events', () => {
            spyOn(dialogService, 'alertAccept');
            spyOn(dialogService, 'alertReject');

            dialogService.alert({
                header: '',
                message: '',
                footerLabel: {
                    accept: 'accept',
                    reject: 'reject'
                }
            });

            fixture.detectChanges();

            const buttons = de.queryAll(By.css('p-dialog button'));
            buttons[1].nativeElement.click();
            expect(dialogService.alertAccept).toHaveBeenCalledTimes(1);
            buttons[0].nativeElement.click();
            expect(dialogService.alertReject).toHaveBeenCalledTimes(1);
        });
    });
});
