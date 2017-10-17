import { DOTTestBed } from '../../../../test/dot-test-bed';
import { MessageService } from '../../../../api/services/messages-service';
import { ContentTypeFieldsVariablesComponent } from './content-type-fields-variables.component';
import { ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, SimpleChange, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockMessageService } from '../../../../test/message-service.mock';
import { FormBuilder, FormGroup } from '@angular/forms';
import { tick } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';
import { Field } from '../index';

@Component({
    template: `<dot-content-type-fields-variables [form]="form"
                                                  [field]="field">
               </dot-content-type-fields-variables>`
})
class TestHostComponent {
    form: FormGroup;
    field; Field;
}

fdescribe('ContentTypeFieldsVariablesComponent', () => {
    let comp: ContentTypeFieldsVariablesComponent;
    let de: DebugElement;
    let el: HTMLElement;

    let field: Field;
    let fb: FormBuilder;

    let fixture: ComponentFixture<TestHostComponent>;

    const COLUMNS_INDEX = {
        key: 0,
        value: 1
    };

    function editCell(rowIndex: number, colName: string, value: string) {
        const pDataTable = de.query(By.css('p-dataTable'));
        const fieldVariablesValue = comp.form.get('fieldVariables').value;

        fieldVariablesValue[rowIndex][colName] = value;
        const rowElement = pDataTable.queryAll(By.css('tbody tr'))[rowIndex];
        const colElement = rowElement.queryAll(By.css('td'))[COLUMNS_INDEX[colName]];
        const inputElement = colElement.query(By.css('input'));

        inputElement.nativeElement.value = value;
        inputElement.triggerEventHandler('blur', null);
    }

    beforeEach(async(() => {

        const messageServiceMock = new MockMessageService({
            'contenttypes.field.variables.key.label': 'Key',
            'contenttypes.field.variables.value.label': 'Value',
            'contenttypes.field.variables.key.new': 'New key',
            'contenttypes.field.variables.value.new': 'New value'
        });

        DOTTestBed.configureTestingModule({
            declarations: [
                TestHostComponent,
                ContentTypeFieldsVariablesComponent,
            ],
            imports: [
            ],
            providers: [
                { provide: MessageService, useValue: messageServiceMock }
            ],
        });

        fixture = DOTTestBed.createComponent(TestHostComponent);
        de = fixture.debugElement.query(By.css('dot-content-type-fields-variables'));
        comp = de.componentInstance;
        el = de.nativeElement;

        field = {
            name: 'field name',
            fieldVariables: [
                {
                    key: 'key1',
                    value: 'value1'
                },
                {
                    key: 'key2',
                    value: 'value2'
                }
            ]
        };

        fb = new FormBuilder();
        fixture.componentInstance.form = fb.group({});
        fixture.componentInstance.field = field;

        fixture.detectChanges();
    }));

    it('should has a p-dataTable', () => {
        const pDataTable = de.query(By.css('p-dataTable'));
        expect(pDataTable).not.toBeNull();
    });

    it('should set p-dataTable editable', () => {
        const pDataTable = de.query(By.css('p-dataTable'));
        expect(true).toEqual(pDataTable.componentInstance.editable);
    });

    it('the first column should be "Key"', () => {
        const pDataTable = de.query(By.css('p-dataTable'));
        const keyColumnHeadElement = pDataTable.query(By.css('thead tr th span'));

        expect('Key').toEqual(keyColumnHeadElement.nativeElement.textContent);
    });

    it('the second column should be "Value"', () => {
        const pDataTable = de.query(By.css('p-dataTable'));
        const valueColumnHeadElement = pDataTable.queryAll(By.css('thead tr th span'))[1];

        expect('Value').toEqual(valueColumnHeadElement.nativeElement.textContent);
    });

    it('the form should has a fieldVariables property', () => {
        expect(comp.form.controls['fieldVariables']).toBeDefined('field variables should be denifed');
    });

    it('the form should has a the right fieldVariables value', () => {
        const fieldVariablesValue = comp.form.get('fieldVariables').value;
        // one row is the new variables row
        expect(3).toEqual(fieldVariablesValue.length, 'should be two variables more the new variable row');

        expect('key1').toEqual(fieldVariablesValue[1].key, 'second elements key should be key1');
        expect('value1').toEqual(fieldVariablesValue[1].value, 'second elements value should be value1');

        expect('key2').toEqual(fieldVariablesValue[2].key, 'third elements key should be key2');
        expect('value2').toEqual(fieldVariablesValue[2].value, 'third elements value should be value2');
    });

    it('should has new variable row', () => {
        const fieldVariablesValue = comp.form.get('fieldVariables').value;
        expect(comp.isFirstRowEmpty()).toBe(true, 'firts row must be empty');
    });

    it('the form should has a null fieldVariables property', () => {
        comp.field.fieldVariables = null;

        fixture.detectChanges();

        expect(comp.form.controls['fieldVariables']).toBeDefined('field variables should be denifed');
    });

    it('should has a new add variable row', fakeAsync(() => {

        editCell(0, 'key', 'key0');
        expect(3).toEqual(comp.form.get('fieldVariables').value.length, 'should has one row more');

        editCell(0, 'value', 'value0');
        expect(4).toEqual(comp.form.get('fieldVariables').value.length, 'should has one row more');
        expect(comp.isFirstRowEmpty()).toBe(true, 'firts row must be empty');
    }));

    it('p-dataTable should has the right value', () => {
        const pDataTable = de.query(By.css('p-dataTable'));
        const tableContents = pDataTable.queryAll(By.css('tbody .ui-editable-column span'));

        expect(comp.isFirstRowEmpty()).toEqual(true, 'the first row should be empty');
        expect('key1').toEqual(tableContents[2].nativeElement.textContent, 'should be key1');
        expect('value1').toEqual(tableContents[3].nativeElement.textContent, 'should be value1');
        expect('key2').toEqual(tableContents[4].nativeElement.textContent, 'should be key2');
        expect('value2').toEqual(tableContents[5].nativeElement.textContent, 'should be value2');
    });

    it('should remove a variables field', () => {
        const pDataTable = de.query(By.css('p-dataTable'));
        const removeButton = pDataTable.query(By.css('tbody tr td span button'));

        removeButton.nativeElement.click(field[0]);

        const fieldVariablesValue = comp.form.get('fieldVariables').value;
        expect(2).toEqual(fieldVariablesValue.length, 'should has one row more');

        // Cheking if remove the right variable
        const tableContents = pDataTable.queryAll(By.css('tbody .ui-editable-column span'))
                                        .filter(element => !element.query(By.css('button')));

        expect(comp.isFirstRowEmpty()).toEqual(true, 'the first row should be empty');
        expect('key2').toEqual(tableContents[4].nativeElement.textContent, 'should be key2');
        expect('value2').toEqual(tableContents[5].nativeElement.textContent, 'should be value2');
    });


    it('the first row should not has a remove button', () => {
        const pDataTable = de.query(By.css('p-dataTable'));
        const firstRow = pDataTable.query(By.css('tbody tr'));
        const removeButton = firstRow.query(By.css('td span button'));

        expect(removeButton).toBeNull();
    });

    it('should dont have the empty row', () => {
        comp.removeEmptyRow();

        const fieldVariablesValue = comp.form.get('fieldVariables').value;
        expect(2).toEqual(fieldVariablesValue.length, 'should have not the ad row');
    });
});
