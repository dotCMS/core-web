import { ConfirmationService } from 'primeng/primeng';
import { LoginService } from 'dotcms-js/dotcms-js';
import { DotDialogService } from './dot-dialog.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { LoginServiceMock } from '../../../test/login-service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { fakeAsync, tick } from '@angular/core/testing';

describe('DotDialogService', () => {
    let mockData;
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
                }
            ],
            imports: [RouterTestingModule]
        });

        mockData = {
            footerLabel: {
                accept: 'Delete',
                reject: 'Reject'
            }
        };

        service = testbed.get(DotDialogService);
        confirmationService = testbed.get(ConfirmationService);
    });

    it('should set confirmation model', () => {
        service.confirm(mockData);
        expect(service.confirmModel).toEqual(mockData);
    });

    it('should call confirmation service with data parameter', fakeAsync(() => {
        spyOn(confirmationService, 'confirm');

        service.confirm(mockData);
        tick();
        expect(confirmationService.confirm).toHaveBeenCalledWith(mockData);
    }));

    it('should clear confirmation model', () => {
        service.confirm(mockData);
        service.clearConfirm();
        expect(service.confirmModel).toEqual(null);
    });

    it('should set alert model', () => {
        service.alert(mockData);
        expect(service.alertModel).toEqual(mockData);
    });

    it('should clear alert model', () => {
        service.alert(mockData);
        service.clearAlert();
        expect(service.alertModel).toEqual(null);
    });
});
