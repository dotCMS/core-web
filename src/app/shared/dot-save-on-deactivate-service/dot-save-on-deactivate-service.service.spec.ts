import { DotSaveOnDeactivateServiceService } from './dot-save-on-deactivate-service.service';
import { DotDialogService } from '../../api/services/dot-dialog/dot-dialog.service';
import { DOTTestBed } from '../../test/dot-test-bed';
import { LoginService } from 'dotcms-js/dotcms-js';
import { LoginServiceMock } from '../../test/login-service.mock';
import { OnSaveDeactivate } from './save-on-deactivate';
import { Observable } from 'rxjs/Observable';
import { DotDialog } from '../models/dot-confirmation/dot-confirmation.model';
import { Component } from '@angular/core';

@Component({
    selector: 'dot-test',
    template: '<h1>Test</h1>'
})
class MockComponent implements OnSaveDeactivate {
    modelChanged(): boolean {
        return true;
    }

    onDeactivateSave(): Observable<any> {
        return Observable.of('Saved');
    }

    saveWarningMessages(): DotDialog {
        return { header: 'Header', message: 'message' };
    }
}

describe('DotSaveOnDeactivateServiceService', () => {
    let dotSaveOnDeactivateServiceService: DotSaveOnDeactivateServiceService;
    let mockComponent: MockComponent;
    let dotDialogService: DotDialogService;
    beforeEach(() => {
        const testbed = DOTTestBed.configureTestingModule({
            declarations: [MockComponent],
            providers: [
                DotSaveOnDeactivateServiceService,
                DotDialogService,
                {
                    provide: LoginService,
                    useClass: LoginServiceMock
                }
            ],
            imports: []
        });
        dotSaveOnDeactivateServiceService = testbed.get(DotSaveOnDeactivateServiceService);
        dotDialogService = testbed.get(DotDialogService);
        mockComponent = new MockComponent();
    });

    it('should return true if there is not changes in the model', () => {
        spyOn(mockComponent, 'modelChanged').and.returnValue(false);

        dotSaveOnDeactivateServiceService.canDeactivate(mockComponent, null, null).subscribe(val => {
            expect(val).toBeTruthy();
        });
    });

    it('should return Observable of true AND call onDeactivateSave', () => {
        spyOn(mockComponent, 'onDeactivateSave').and.callThrough();
        spyOn(dotDialogService, 'confirm').and.callFake(conf => {
            conf.accept();
        });
        dotSaveOnDeactivateServiceService.canDeactivate(mockComponent, null, null).subscribe(val => {
            expect(val).toBeTruthy();
            expect(mockComponent.onDeactivateSave).toHaveBeenCalled();
        });
    });

    it('should return Observable of true if the user decide NOT to save the latest changes', () => {
        spyOn(mockComponent, 'onDeactivateSave').and.callThrough();
        spyOn(dotDialogService, 'confirm').and.callFake(conf => {
            conf.reject();
        });
        dotSaveOnDeactivateServiceService.canDeactivate(mockComponent, null, null).subscribe(val => {
            expect(val).toBeTruthy();
            expect(mockComponent.onDeactivateSave).toHaveBeenCalledTimes(0);
        });
    });
});
