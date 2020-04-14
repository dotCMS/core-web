import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { DotContentTypeFieldsVariablesComponent } from './dot-content-type-fields-variables.component';
import { LoginService } from 'dotcms-js';
import { DotFieldVariablesService } from './services/dot-field-variables.service';
import { DOTTestBed } from '@tests/dot-test-bed';
import { LoginServiceMock } from '@tests/login-service.mock';
import {
    DotFieldVariablesServiceMock,
    mockFieldVariables
} from '@tests/field-variable-service.mock';
import { of } from 'rxjs';
import * as _ from 'lodash';
import { dotcmsContentTypeFieldBasicMock } from '@tests/dot-content-types.mock';
import { DotMessageDisplayService } from '@components/dot-message-display/services';
import { DotCMSContentTypeField } from 'dotcms-models';
import { DotKeyValueModule } from '@components/dot-key-value/dot-key-value.module';
import { DotFieldVariable } from './models/dot-field-variable.interface';

@Component({
    selector: 'dot-test-host-component',
    template: `
        <dot-content-type-fields-variables [field]="value"></dot-content-type-fields-variables>
    `
})
class TestHostComponent {
    value: DotCMSContentTypeField = {
        ...dotcmsContentTypeFieldBasicMock,
        contentTypeId: 'ddf29c1e-babd-40a8-bfed-920fc9b8c77',
        id: mockFieldVariables[0].fieldId
    };
}

describe('DotContentTypeFieldsVariablesComponent', () => {
    let fixtureHost: ComponentFixture<TestHostComponent>;
    let deHost: DebugElement;
    let comp: DotContentTypeFieldsVariablesComponent;
    let de: DebugElement;
    let dotFieldVariableService: DotFieldVariablesService;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [TestHostComponent, DotContentTypeFieldsVariablesComponent],
            imports: [
                DotKeyValueModule
            ],
            providers: [
                { provide: LoginService, useClass: LoginServiceMock },
                {
                    provide: DotFieldVariablesService,
                    useClass: DotFieldVariablesServiceMock
                },
                DotMessageDisplayService
            ]
        });

        fixtureHost = DOTTestBed.createComponent(TestHostComponent);
        deHost = fixtureHost.debugElement;
        de = deHost.query(By.css('dot-content-type-fields-variables'));
        comp = de.componentInstance;

        dotFieldVariableService = de.injector.get(DotFieldVariablesService);

    });

    it('should load the component with one empty row', () => {
        spyOn(dotFieldVariableService, 'load').and.returnValue(of([]));
        fixtureHost.detectChanges();
        expect(comp.fieldVariables[0]).toEqual({ key: '', value: '' });
    });

    it('should save a variable', () => {
        spyOn(dotFieldVariableService, 'save').and.returnValue(of(mockFieldVariables[0]));
        const response = { variable: mockFieldVariables[0], variableIndex: 0 };

        fixtureHost.detectChanges();

        const dotKeyValue = de.query(By.css('dot-key-value')).componentInstance;
        dotKeyValue.save.emit(response);
        expect(dotFieldVariableService.save).toHaveBeenCalledWith(
            comp.field,
            mockFieldVariables[0]
        );
        expect(comp.fieldVariables[0]).toEqual({ key: '', value: '' });
        expect(comp.fieldVariables[1]).toEqual(mockFieldVariables[0]);
    });

    it('should delete a variable from the server', () => {
        spyOn(dotFieldVariableService, 'delete').and.returnValue(of([]));
        const deletedCollection = [{ key: '', value: '' }].concat(
            mockFieldVariables.filter((_item: DotFieldVariable, index: number) => index !== 0)
        );
        fixtureHost.detectChanges();

        const dotKeyValue = de.query(By.css('dot-key-value')).componentInstance;
        dotKeyValue.delete.emit(1);

        expect(dotFieldVariableService.delete).toHaveBeenCalledWith(
            comp.field,
            mockFieldVariables[0]
        );
        expect(comp.fieldVariables).toEqual(deletedCollection);
    });

});
