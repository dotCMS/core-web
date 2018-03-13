import { MockDotMessageService } from '../../../test/dot-message-service.mock';
import { DotDialog } from '../../../shared/models/dot-confirmation/dot-confirmation.model';
import { ConfirmationService } from 'primeng/primeng';
import { LoginService } from 'dotcms-js/dotcms-js';
import { DotDialogService } from './dot-dialog.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { LoginServiceMock } from '../../../test/login-service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { DotMessageService } from '../dot-messages-service';

const messageServiceMock = new MockDotMessageService({
    'dot.common.dialog.accept': 'Go',
    'dot.common.dialog.reject': 'No'
});

describe('DotDialogService', () => {
    let mockData: DotDialog;
    let service: DotDialogService;
    let confirmationService: ConfirmationService;

    beforeEach(() => {
        const testbed = DOTTestBed.configureTestingModule({
            providers: [
                DotDialogService,
                ConfirmationService,
                {
                    provide: LoginService,
                    useClass: LoginServiceMock
                },
                {
                    provide: DotMessageService,
                    useValue: messageServiceMock
                }
            ],
            imports: [RouterTestingModule]
        });

        mockData = {
            header: 'Header',
            message: 'Message',
            accept: jasmine.createSpy('accept'),
            reject: jasmine.createSpy('reject'),
            footerLabel: {
                accept: 'Delete',
                reject: 'Reject'
            }
        };

        service = testbed.get(DotDialogService);
        confirmationService = testbed.get(ConfirmationService);
    });

    describe('confirmation', () => {
        it('should set model and call confirm method in primeng service', fakeAsync(() => {
            spyOn(confirmationService, 'confirm');
            service.confirm(mockData);
            tick();
            expect(service.confirmModel).toEqual(mockData);
            expect(confirmationService.confirm).toHaveBeenCalledWith(mockData);
        }));

        it('should set model with default labels', () => {
            service.confirm({
                header: 'Header',
                message: 'Message'
            });
            expect(service.confirmModel).toEqual({
                header: 'Header',
                message: 'Message',
                footerLabel: {
                    accept: 'Go',
                    reject: 'No'
                }
            });
        });

        it('should clear model', () => {
            service.confirm(mockData);
            service.clearConfirm();
            expect(service.confirmModel).toEqual(null);
        });
    });

    describe('alert', () => {
        it('should set model', () => {
            service.alert(mockData);
            expect(service.alertModel).toEqual(mockData);
        });

        it('should set alert with default labels', () => {
            service.alert({
                header: 'Header',
                message: 'Message'
            });
            expect(service.alertModel).toEqual({
                header: 'Header',
                message: 'Message',
                footerLabel: {
                    accept: 'Go'
                }
            });
        });

        it('should exec accept function and clear model', () => {
            service.alert(mockData);
            service.alertAccept(new MouseEvent('click'));
            expect(mockData.accept).toHaveBeenCalledTimes(1);
            expect(service.alertModel).toEqual(null);
        });

        it('should exec reject function and clear model', () => {
            service.alert(mockData);
            service.alertReject(new MouseEvent('click'));
            expect(mockData.reject).toHaveBeenCalledTimes(1);
            expect(service.alertModel).toEqual(null);
        });
    });

});
