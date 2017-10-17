import { async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DebugElement, Component, Input, SimpleChange, Output, EventEmitter, Injectable } from '@angular/core';
import { ContentTypeFieldsDropZoneComponent } from './';
import { By } from '@angular/platform-browser';
import { Field, FieldRow, ContentTypeFieldsPropertiesFormComponent } from '../';
import { DragulaModule } from 'ng2-dragula';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldValidationMessageModule } from '../../../../view/components/_common/field-validation-message/file-validation-message.module';
import { MessageService } from '../../../../api/services/messages-service';
import { LoginService, SocketFactory } from 'dotcms-js/dotcms-js';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { FormatDateService } from '../../../../api/services/format-date-service';
import { MockMessageService } from '../../../../test/message-service.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs/Subject';
import { FieldDragDropService } from '../service/index';
import { FieldPropertyService } from '../service/field-properties.service';
import { FieldService } from '../service/field.service';

@Component({
    selector: 'content-type-fields-row',
    template: ''
})
class TestContentTypeFieldsRow {
    @Input() fieldRow: FieldRow;
    @Output() editField: EventEmitter<Field> = new EventEmitter();
    @Output() removeField: EventEmitter<Field> = new EventEmitter();
    @Output() removeRow: EventEmitter<FieldRow> = new EventEmitter();
}

@Component({
    selector: 'dot-content-type-fields-form-layout',
    template: ''
})
class TestContentTypeFieldsFormLayout {
    @Input() field: Field;

    get value(): any {
        return this.field;
    }
}

@Component({
    selector: 'p-overlayPanel',
    template: ''
})
class TestPOverlayPanelComponent {

}

@Component({
    template: `<dot-content-type-fields-drop-zone [fields]="fields"
                                                  (saveFields)="saveFields($event)"
                                                  (removeFields)="removeFields($event)"
                                                  (removeRow)="removeFields($event)">
               </dot-content-type-fields-drop-zone>`
})
class TestHostComponent {
    @Input() fields: Field[];

    saveFields(fields: Field[]): void {
    }

    removeFields(fields: Field[]): void {
    }
}

@Injectable()
class TestFieldDragDropService {
    _fieldDropFromSource: Subject<any> = new Subject();
    _fieldDropFromTarget: Subject<any> = new Subject();
    _fieldRowDropFromTarget: Subject<any> = new Subject();

    get fieldDropFromSource$(): Observable<any> {
        return this._fieldDropFromSource.asObservable();
    }

    get fieldDropFromTarget$(): Observable<any> {
        return this._fieldDropFromTarget.asObservable();
    }

    get fieldRowDropFromTarget$(): Observable<any> {
        return this._fieldRowDropFromTarget.asObservable();
    }
}

function becomeNewField(field) {
    delete field.id;
}

function getFields() {
    return [
        {
            name: 'field 1',
            id: '1',
            clazz: 'com.dotcms.contenttype.model.field.ImmutableLineDividerField',
            sortOrder: 1
        },
        {
            name: 'field 2',
            id: '2',
            clazz: 'com.dotcms.contenttype.model.field.ImmutableTabDividerField',
            sortOrder: 2
        },
        {
            clazz: 'text',
            id: '3',
            name: 'field 3',
            sortOrder: 3
        },
        {
            clazz: 'text',
            id: '4',
            name: 'field 4',
            sortOrder: 4
        },
        {
            clazz: 'com.dotcms.contenttype.model.field.ImmutableTabDividerField',
            id: '5',
            name: 'field 5',
            sortOrder: 5
        },
        {
            clazz: 'text',
            id: '6',
            name: 'field 6',
            sortOrder: 6
        },
        {
            clazz: 'com.dotcms.contenttype.model.field.ImmutableLineDividerField',
            id: '7',
            name: 'field 7',
            sortOrder: 7
        },
        {
            clazz: 'com.dotcms.contenttype.model.field.ImmutableTabDividerField',
            id: '8',
            name: 'field 8',
            sortOrder: 8
        },
        {
            clazz: 'text',
            id: '9',
            name: 'field 9',
            sortOrder: 9
        }
    ];
}

describe('ContentTypeFieldsDropZoneComponent', () => {
    let comp: ContentTypeFieldsDropZoneComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };
    const messageServiceMock = new MockMessageService({
        'contenttypes.dropzone.action.save': 'Save',
        'contenttypes.dropzone.action.cancel': 'Cancel',
        'contenttypes.dropzone.action.edit': 'Edit',
        'contenttypes.dropzone.action.create.field': 'Create field'
    });

    beforeEach(async(() => {
        this.testFieldDragDropService = new TestFieldDragDropService();

        DOTTestBed.configureTestingModule({
            declarations: [
                ContentTypeFieldsDropZoneComponent,
                TestContentTypeFieldsRow,
                TestContentTypeFieldsFormLayout,
                TestPOverlayPanelComponent,
                TestHostComponent
            ],
            imports: [
                RouterTestingModule.withRoutes([{
                    component: ContentTypeFieldsDropZoneComponent,
                    path: 'test'
                }]),
                DragulaModule,
                FieldValidationMessageModule,
                ReactiveFormsModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: FieldDragDropService, useValue: this.testFieldDragDropService},
                LoginService,
                SocketFactory,
                FormatDateService,
                FieldPropertyService,
                FieldService,
                { provide: MessageService, useValue: messageServiceMock },
                { provide: Router, useValue: mockRouter }
            ]
        });

        fixture = DOTTestBed.createComponent(TestHostComponent);
        de = fixture.debugElement.query(By.css('dot-content-type-fields-drop-zone'));
        comp = de.componentInstance;
        el = de.nativeElement;
    }));

    it('should has fieldsContainer', () => {
        const fieldsContainer = de.query(By.css('.content-type-fields-drop-zone__container'));
        expect(fieldsContainer).not.toBeNull();
    });

    it('should has the right dragula attributes', () => {
        const fieldsContainer = de.query(By.css('.content-type-fields-drop-zone__container'));
        expect('target').toEqual(fieldsContainer.attributes['data-drag-type']);
        expect('fields-row-bag').toEqual(fieldsContainer.attributes['dragula']);
    });

    it('should has a dialog', () => {
        const dialog = de.query(By.css('p-dialog'));
        expect(dialog).not.toBeNull();
    });

    describe('Remove fields', () => {
        const fields: Field[] = getFields();

        beforeEach(async(() => {
            fixture.debugElement.componentInstance.fields = fields;
            fixture.detectChanges();
        }));

        it('should emit removeFields when a field is removed', fakeAsync(() => {
            const removeFieldElement = de.query(By.css('content-type-fields-row'));
            const removeFieldsSpy = spyOn(fixture.componentInstance, 'removeFields');
            removeFieldElement.componentInstance.removeField.emit(fields[2]);
            expect(removeFieldsSpy).toHaveBeenCalledWith([fields[2]]);
        }));

        it('should emit removeFields event when a Row is removed', fakeAsync(() => {

            const removeFieldElement = de.query(By.css('content-type-fields-row'));
            const fieldRow = removeFieldElement.componentInstance.fieldRow;
            const removeFieldsSpy = spyOn(fixture.componentInstance, 'removeFields');

            removeFieldElement.componentInstance.removeRow.emit(fieldRow);

            expect(removeFieldsSpy).toHaveBeenCalledWith(fields.slice(0, 6));
        }));
    });

    describe('Load fields and drag and drop', () => {

        const fields: Field[] = getFields();

        beforeEach(async(() => {
            fixture.debugElement.componentInstance.fields = fields;
            fixture.detectChanges();
        }));

        it('should handler editField event', () => {
            const fieldType = {
                id: '1',
                label: 'label',
                clazz: 'clazz',
                helpText: 'helpText',
                properties: []
            };
            const  fieldPropertyService = fixture.debugElement.injector.get(FieldPropertyService);
            const removeFieldElement = de.query(By.css('content-type-fields-row'));

            const getFieldTypeMethod = spyOn(fieldPropertyService, 'getFieldType').and.returnValue(fieldType);

            removeFieldElement.componentInstance.editField.emit(fields[2]);

            fixture.detectChanges();

            expect(fields[2]).toBe(comp.formData);
            expect(fieldType).toBe(comp.currentFieldType);

            const dialog = de.query(By.css('p-dialog'));
            expect(true).toBe(dialog.componentInstance.visible);
        });

        it('should has FieldRow and FieldColumn', () => {
            const fieldsContainer = de.query(By.css('.content-type-fields-drop-zone__container'));
            const fieldRows = fieldsContainer.queryAll(By.css('content-type-fields-row'));
            expect(2).toEqual(fieldRows.length);

            expect(2).toEqual(fieldRows[0].componentInstance.fieldRow.columns.length);
            expect(2).toEqual(fieldRows[0].componentInstance.fieldRow.columns[0].fields.length);
            expect(1).toEqual(fieldRows[0].componentInstance.fieldRow.columns[1].fields.length);

            expect(1).toEqual(fieldRows[1].componentInstance.fieldRow.columns.length);
            expect(1).toEqual(fieldRows[1].componentInstance.fieldRow.columns[0].fields.length);
        });

        it('should display dialog if a drop event happen from source', fakeAsync(() => {

            this.testFieldDragDropService._fieldDropFromSource.next(['fields-bag', null, null, {
                dataset: {
                    dragType: 'source'
                }
            }]);

            tick();
            fixture.detectChanges();

            expect(true).toBe(comp.displayDialog);

            const dialog = de.query(By.css('p-dialog'));
            expect(true).toBe(dialog.componentInstance.visible);
        }));

        it('should save all the fields (moving the last line to the top)', () => {
            const testFields = [...fields.slice(6, 9), ...fields.slice(0, 6)];
            fixture.componentInstance.fields = testFields;

            fixture.detectChanges();

            const saveFieldsSpy = spyOn(fixture.componentInstance, 'saveFields');

            this.testFieldDragDropService._fieldRowDropFromTarget.next(['fields-bag', null, null, {
                dataset: {
                    dragType: 'target'
                }
            }]);

            fixture.detectChanges();

            expect(saveFieldsSpy).toHaveBeenCalledWith(testFields);
        });

        it('should save all the fields (moving just the last field)', () => {
            const testFields = [...fields.slice(0, 5), fields[8], ...fields.slice(5, 8)];
            fixture.componentInstance.fields = testFields;

            fixture.detectChanges();

            const saveFieldsSpy = spyOn(fixture.componentInstance, 'saveFields');

            this.testFieldDragDropService._fieldDropFromTarget.next(['fields-bag', null, null, {
                dataset: {
                    dragType: 'target'
                }
            }]);

            fixture.detectChanges();

            expect(saveFieldsSpy).toHaveBeenCalledWith(testFields);
        });

        it('should save all the new fields', fakeAsync(() => {
            const saveFieldsSpy = spyOn(fixture.componentInstance, 'saveFields');

            becomeNewField(fields[6]);
            becomeNewField(fields[7]);
            becomeNewField(fields[8]);

            // sleect the fields[8] as the current field
            this.testFieldDragDropService._fieldDropFromSource.next(['fields-bag', null, null, {
                dataset: {
                    dragType: 'source'
                }
            }]);

            fixture.detectChanges();

            const saveButton = de.queryAll(By.css('p-dialog button'))[1];
            saveButton.nativeElement.click();

            tick();

            expect(saveFieldsSpy).toHaveBeenCalledWith([fields[6], fields[7], fields[8]]);
        }));
    });
});
