import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { DotMessageService } from '@services/dot-messages-service';
import { DOTTestBed } from '@tests/dot-test-bed';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { TableModule } from 'primeng/table';
import * as _ from 'lodash';
import { DotMessageDisplayService } from '@components/dot-message-display/services';
import { DotKeyValueTableRowModule } from '@components/dot-key-value/dot-key-value-table-row/dot-key-value-table-row.module';
import { DotKeyValueComponent } from './dot-key-value.component';
import { DotKeyValue } from '@shared/models/dot-key-value/dot-key-value.model';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotKeyValueTableRowComponent } from './dot-key-value-table-row/dot-key-value-table-row.component';

export const mockKeyValue = [
    {
        key: 'name',
        hidden: false,
        value: 'John'
    },
    {
        key: 'password',
        hidden: true,
        value: '*****'
    }
];
@Component({
    selector: 'dot-test-host-component',
    template: ` <dot-key-value [variables]="value"></dot-key-value> `
})
class TestHostComponent {
    value: DotKeyValue[] = mockKeyValue;
}

describe('DotKeyValueComponent', () => {
    let fixtureHost: ComponentFixture<TestHostComponent>;
    let componentHost: TestHostComponent;
    let deHost: DebugElement;
    let component: DotKeyValueComponent;
    let de: DebugElement;
    let tableRow: DotKeyValueTableRowComponent;

    beforeEach(() => {
        const messageServiceMock = new MockDotMessageService({
            'keyValue.actions_header.label': 'Actions',
            'keyValue.value_header.label': 'Value',
            'keyValue.key_header.label': 'Key',
            'keyValue.value_no_rows.label': 'No Rows',
            Save: 'Save',
            Cancel: 'Cancel'
        });

        DOTTestBed.configureTestingModule({
            declarations: [TestHostComponent, DotKeyValueComponent],
            imports: [DotIconModule, TableModule, DotKeyValueTableRowModule],
            providers: [
                { provide: DotMessageService, useValue: messageServiceMock },
                DotMessageDisplayService
            ]
        });

        fixtureHost = DOTTestBed.createComponent(TestHostComponent);
        deHost = fixtureHost.debugElement;
        componentHost = fixtureHost.componentInstance;
        de = deHost.query(By.css('dot-key-value'));
        component = de.componentInstance;
    });

    it('should load the component with no rows', () => {
        componentHost.value = [];
        fixtureHost.detectChanges();

        const dataTable = de.query(By.css('p-table'));
        expect(dataTable.nativeElement.innerText).toContain('Key');
        expect(dataTable.nativeElement.innerText).toContain('Value');
        expect(dataTable.nativeElement.innerText).toContain('Actions');
        expect(dataTable.nativeElement.innerText).toContain('No Rows');
    });

    it('should load the component with data', () => {
        fixtureHost.detectChanges();
        const dataTable = de.query(By.css('p-table'));
        tableRow = de.query(By.css('dot-key-value-table-row')).componentInstance;
        expect(tableRow.variablesList).toEqual(mockKeyValue);
        expect(dataTable.componentInstance.value).toEqual(mockKeyValue);
        expect(dataTable.listeners[0].name).toBe('keydown.enter');
    });

    it('should save a variable', () => {
        spyOn(component.save, 'emit');

        fixtureHost.detectChanges();

        tableRow = de.query(By.css('dot-key-value-table-row')).componentInstance;
        tableRow.save.emit(0);
        expect(component.save.emit).toHaveBeenCalledWith({
            variable: mockKeyValue[0],
            index: 0
        });
    });

    it('should delete a variable from the server', () => {
        spyOn(component.delete, 'emit');
        fixtureHost.detectChanges();

        tableRow = de.query(By.css('dot-key-value-table-row')).componentInstance;
        tableRow.delete.emit(0);

        expect(component.delete.emit).toHaveBeenCalledWith(0);
    });

    it('should restore a variable value with saved value in the UI, when cancelled', () => {
        fixtureHost.detectChanges();

        tableRow = de.query(By.css('dot-key-value-table-row')).componentInstance;
        tableRow.cancel.emit(0);

        expect(component.variables[0]).toEqual(component.variablesBackup[0]);
    });

    it('should stop propagation of keydown.enter event in the datatable', () => {
        fixtureHost.detectChanges();
        const stopPropagationSpy = jasmine.createSpy('spy');
        const dataTable = de.query(By.css('p-table'));
        dataTable.triggerEventHandler('keydown.enter', {
            stopPropagation: stopPropagationSpy
        });

        expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
    });
});
