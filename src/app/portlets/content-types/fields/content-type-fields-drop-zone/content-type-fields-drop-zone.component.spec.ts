import { async, ComponentFixture } from '@angular/core/testing';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DebugElement, Component, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { ContentTypeFieldsDropZoneComponent } from './';
import { By } from '@angular/platform-browser';
import {
    ContentTypeField,
    FieldRow,
    ContentTypeFieldsAddRowModule,
    FieldTab,
    FieldDivider
} from '../';
import { ReactiveFormsModule } from '@angular/forms';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { DotActionButtonModule } from '@components/_common/dot-action-button/dot-action-button.module';
import { DotMessageService } from '@services/dot-messages-service';
import { LoginService, DotEventsSocketFactoryService } from 'dotcms-js';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, Subject } from 'rxjs';
import { FormatDateService } from '@services/format-date-service';
import { MockDotMessageService } from '../../../../test/dot-message-service.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FieldDragDropService } from '../service/index';
import { FieldPropertyService } from '../service/field-properties.service';
import { FieldService } from '../service/field.service';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { HotkeysService } from 'angular2-hotkeys';
import { TestHotkeysMock } from '../../../../test/hotkeys-service.mock';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import * as _ from 'lodash';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import { TableModule } from 'primeng/table';
import { DotContentTypeFieldsVariablesModule } from '../dot-content-type-fields-variables/dot-content-type-fields-variables.module';
import { DotLoadingIndicatorService } from '@components/_common/iframe/dot-loading-indicator/dot-loading-indicator.service';

@Component({
    selector: 'dot-content-type-fields-row',
    template: ''
})
class TestContentTypeFieldsRowComponent {
    @Input()
    fieldRow: FieldRow;
    @Output()
    editField: EventEmitter<ContentTypeField> = new EventEmitter();
    @Output()
    removeField: EventEmitter<ContentTypeField> = new EventEmitter();
}

@Component({
    selector: 'dot-content-type-fields-properties-form',
    template: ''
})
class TestContentTypeFieldsPropertiesFormComponent {
    @Output()
    saveField: EventEmitter<any> = new EventEmitter();
    @Input()
    formFieldData: ContentTypeField;

    public destroy(): void {}
}

@Component({
    selector: 'dot-content-type-fields-tab',
    template: ''
})
class TestDotContentTypeFieldsTabComponent {
    @Input()
    fieldTab: FieldTab;

    @Output()
    editTab: EventEmitter<ContentTypeField> = new EventEmitter();
    @Output()
    removeTab: EventEmitter<FieldDivider> = new EventEmitter();
}

@Component({
    selector: 'dot-loading-indicator ',
    template: ''
})
class TestDotLoadingIndicatorComponent {
    @Input()
    fullscreen: boolean;
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

@Injectable()
class TestDotLoadingIndicatorService {
    show(): void {
    }

    hide(): void {
    }
}

function becomeNewField(field) {
    delete field.id;
    delete field.sortOrder;
}

describe('ContentTypeFieldsDropZoneComponent', () => {
    const dotLoadingIndicatorServiceMock = new TestDotLoadingIndicatorService();
    let comp: ContentTypeFieldsDropZoneComponent;
    let fixture: ComponentFixture<ContentTypeFieldsDropZoneComponent>;
    let de: DebugElement;
    const mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };
    const messageServiceMock = new MockDotMessageService({
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
                TestContentTypeFieldsPropertiesFormComponent,
                TestContentTypeFieldsRowComponent,
                TestDotContentTypeFieldsTabComponent,
                TestDotLoadingIndicatorComponent
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {
                        component: ContentTypeFieldsDropZoneComponent,
                        path: 'test'
                    }
                ]),
                BrowserAnimationsModule,
                ContentTypeFieldsAddRowModule,
                DotContentTypeFieldsVariablesModule,
                DotDialogModule,
                DotActionButtonModule,
                DotIconButtonModule,
                DotIconModule,
                DragulaModule,
                TableModule,
                DotFieldValidationMessageModule,
                ReactiveFormsModule
            ],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: HotkeysService, useClass: TestHotkeysMock },
                { provide: FieldDragDropService, useValue: this.testFieldDragDropService },
                { provide: DotMessageService, useValue: messageServiceMock },
                { provide: DotLoadingIndicatorService, useValue: dotLoadingIndicatorServiceMock },
                DotEventsSocketFactoryService,
                LoginService,
                FormatDateService,
                FieldService,
                FieldPropertyService,
                DragulaService
            ]
        });

        fixture = DOTTestBed.createComponent(ContentTypeFieldsDropZoneComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
    }));

    it('should have fieldsContainer', () => {
        const fieldsContainer = de.query(By.css('.content-type-fields-drop-zone__container'));
        expect(fieldsContainer).not.toBeNull();
    });

    it('should have the right dragula attributes', () => {
        const fieldsContainer = de.query(By.css('.content-type-fields-drop-zone__container'));
        expect('fields-row-bag').toEqual(fieldsContainer.attributes['dragula']);
    });

    it('should set Save button disable on load', () => {
        fixture.detectChanges();
        expect(comp.dialogActions.accept.disabled).toBeTruthy();
    });

    it('should have a dialog', () => {
        const dialog = de.query(By.css('dot-dialog'));
        expect(dialog).not.toBeNull();
    });

    it('should reset values when close dialog', () => {
        comp.displayDialog = true;
        spyOn(comp, 'setDialogOkButtonState');
        fixture.detectChanges();
        const dialog = de.query(By.css('dot-dialog')).componentInstance;
        dialog.hide.emit();
        expect(comp.displayDialog).toBe(false);
        expect(comp.hideButtons).toBe(false);
        expect(comp.formData).toBe(null);
        expect(comp.dialogActiveTab).toBe(null);
        expect(comp.setDialogOkButtonState).toHaveBeenCalledWith(false);
    });

    it('should emit removeFields event', () => {
        let fieldsToRemove;

        const field = {
            clazz: 'classField',
            name: 'nameField'
        };

        comp.removeFields.subscribe((removeFields) => (fieldsToRemove = removeFields));


        comp.removeField(field);
        expect([field]).toEqual(fieldsToRemove);
    });

    it('should emit removeFields event when a Row is removed', () => {
        let fieldsToRemove: ContentTypeField[];

        const fieldRow: FieldRow = new FieldRow();
        const field = {
            clazz: 'classField',
            name: 'nameField'
        };
        fieldRow.addFields([field]);
        fieldRow.getFieldDivider().id = 'test';

        comp.removeFields.subscribe((removeFields) => (fieldsToRemove = removeFields));

        comp.removeFieldRow(fieldRow);

        expect([fieldRow.getFieldDivider(), fieldRow.columns[0].columnDivider, field]).toEqual(
            fieldsToRemove
        );
    });

    it('should remove and empty row without lineDivider id, and not emit removeFields ', () => {
        const fieldRow1 = new FieldRow();
        const fieldRow2 = new FieldRow();
        fieldRow1.getFieldDivider().id = 'test';
        comp.fieldRows = [fieldRow1, fieldRow2];
        spyOn(comp.removeFields, 'emit');
        comp.removeFieldRow(fieldRow2);

        expect(comp.removeFields.emit).toHaveBeenCalledTimes(0);
        expect(comp.fieldRows).toEqual([fieldRow1]);
    });

    it('should cancel last drag and drop operation fields', () => {
        comp.fields = [];

        const fieldRow1: FieldRow = new FieldRow();
        const field = {
            clazz: 'classField',
            name: 'nameField'
        };
        fieldRow1.addFields([field]);

        const fieldRow2 = new FieldRow();
        comp.fieldRows = [fieldRow1, fieldRow2];

        comp.cancelLastDragAndDrop();

        expect(comp.fieldRows.length).toEqual(1);
        expect((<FieldRow> comp.fieldRows[0]).columns.length).toEqual(1);
        expect((<FieldRow> comp.fieldRows[0]).columns[0].fields).toEqual([]);
    });
});

let fakeFields: ContentTypeField[];

@Component({
    selector: 'dot-test-host-component',
    template:
        '<dot-content-type-fields-drop-zone [fields]="fields" [loading]="loading"></dot-content-type-fields-drop-zone>'
})
class TestHostComponent {
    fields: ContentTypeField[];
    loading: boolean;

    constructor() {}
}

const removeSortOrder = (fieldRows: FieldRow[]) => {
    return fieldRows.map((fieldRow: FieldRow) => {
        fieldRow.getFieldDivider().sortOrder = null;
        if (fieldRow.columns) {
            fieldRow.columns = fieldRow.columns.map((column) => {
                column.columnDivider.sortOrder = null;
                column.fields = column.fields.map((field) => {
                    field.sortOrder = null;
                    return field;
                });
                return column;
            });
        }
    });
};

describe('Load fields and drag and drop', () => {
    const dotLoadingIndicatorServiceMock: TestDotLoadingIndicatorService = new TestDotLoadingIndicatorService();
    let hostComp: TestHostComponent;
    let hostDe: DebugElement;
    let comp: ContentTypeFieldsDropZoneComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let de: DebugElement;
    const mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };
    const messageServiceMock = new MockDotMessageService({
        'contenttypes.dropzone.action.save': 'Save',
        'contenttypes.dropzone.action.cancel': 'Cancel',
        'contenttypes.dropzone.action.edit': 'Edit',
        'contenttypes.dropzone.action.create.field': 'Create field'
    });

    const moveFromSecondRowToFirstRowAndEmitEvent = () => {
        const fieldsMoved = _.cloneDeep(comp.fieldRows);
        const fieldToMove = fieldsMoved[2].columns[0].fields[0];
        fieldsMoved[2].columns[0].fields = [];
        fieldsMoved[0].columns[1].fields.unshift(fieldToMove);

        this.testFieldDragDropService._fieldDropFromTarget.next({
            item: fieldToMove,
            source: {
                columnId: fieldsMoved[2].columns[0].columnDivider.id,
                model: fieldsMoved[2].columns[0].fields
            },
            target: {
                columnId: fieldsMoved[0].columns[1].columnDivider.id,
                model: fieldsMoved[0].columns[1].fields
            }
        });

        return fieldsMoved;
    };

    beforeEach(async(() => {
        this.testFieldDragDropService = new TestFieldDragDropService();

        DOTTestBed.configureTestingModule({
            declarations: [
                ContentTypeFieldsDropZoneComponent,
                TestContentTypeFieldsRowComponent,
                TestContentTypeFieldsPropertiesFormComponent,
                TestDotContentTypeFieldsTabComponent,
                TestHostComponent,
                TestDotLoadingIndicatorComponent
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {
                        component: ContentTypeFieldsDropZoneComponent,
                        path: 'test'
                    }
                ]),
                DragulaModule,
                DotFieldValidationMessageModule,
                DotContentTypeFieldsVariablesModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                DotActionButtonModule,
                DotIconModule,
                DotIconButtonModule,
                TableModule,
                ContentTypeFieldsAddRowModule,
                DotDialogModule
            ],
            providers: [
                DragulaService,
                FieldPropertyService,
                FieldService,
                FormatDateService,
                LoginService,
                DotEventsSocketFactoryService,
                { provide: DotMessageService, useValue: messageServiceMock },
                { provide: FieldDragDropService, useValue: this.testFieldDragDropService },
                { provide: HotkeysService, useClass: TestHotkeysMock },
                { provide: Router, useValue: mockRouter },
                { provide: DotLoadingIndicatorService, useValue: dotLoadingIndicatorServiceMock },
            ]
        });

        fixture = DOTTestBed.createComponent(TestHostComponent);
        hostComp = fixture.componentInstance;
        hostDe = fixture.debugElement;
        de = hostDe.query(By.css('dot-content-type-fields-drop-zone'));
        comp = de.componentInstance;

        fakeFields = [
            {
                name: 'field 1',
                id: '1',
                clazz: 'com.dotcms.contenttype.model.field.ImmutableRowField',
                sortOrder: 0,
                contentTypeId: '1b'
            },
            {
                name: 'field 2',
                id: '2',
                clazz: 'com.dotcms.contenttype.model.field.ImmutableColumnField',
                sortOrder: 1,
                contentTypeId: '2b'
            },
            {
                clazz: 'text',
                id: '3',
                name: 'field 3',
                sortOrder: 2,
                contentTypeId: '3b'
            },
            {
                clazz: 'com.dotcms.contenttype.model.field.ImmutableColumnField',
                id: '4',
                name: 'field 4',
                sortOrder: 3,
                contentTypeId: '4b'
            },
            {
                clazz: 'text',
                id: '5',
                name: 'field 5',
                sortOrder: 4,
                contentTypeId: '5b'
            },
            {
                clazz: 'com.dotcms.contenttype.model.field.ImmutableTabDividerField',
                id: '6',
                name: 'field 6',
                sortOrder: 5,
                contentTypeId: '6b'
            },
            {
                clazz: 'com.dotcms.contenttype.model.field.ImmutableRowField',
                id: '7',
                name: 'field 7',
                sortOrder: 6,
                contentTypeId: '7b'
            },
            {
                clazz: 'com.dotcms.contenttype.model.field.ImmutableColumnField',
                id: '8',
                name: 'field 8',
                sortOrder: 7,
                contentTypeId: '8b'
            },
            {
                clazz: 'text',
                id: '9',
                name: 'field 9',
                sortOrder: 8,
                contentTypeId: '9b'
            }
        ];

        hostComp.fields = fakeFields;
    }));

    it('should handler editField event', () => {
        const field = {
            clazz: 'classField',
            name: 'nameField'
        };
        const spy = spyOn(comp, 'editField');

        fixture.detectChanges();

        const fieldsContainer = de.query(By.css('.content-type-fields-drop-zone__container'));
        const fieldRows = fieldsContainer.queryAll(By.css('dot-content-type-fields-row'));
        fieldRows[0].componentInstance.editField.emit(field);
        expect(spy).toHaveBeenCalledWith(field);
    });

    it('should emit and create 2 columns', () => {
        spyOn(comp, 'addRow');
        fixture.detectChanges();
        const addRowsContainer = de.query(By.css('dot-add-rows')).componentInstance;
        addRowsContainer.selectColums.emit(2);
        expect(comp.addRow).toHaveBeenCalled();
        expect((<FieldRow>comp.fieldRows[0]).columns.length).toBe(2);
    });

    it('should have FieldRow and FieldColumn', () => {
        fixture.detectChanges();

        const fieldsContainer = de.query(By.css('.content-type-fields-drop-zone__container'));
        const fieldRows = fieldsContainer.queryAll(By.css('dot-content-type-fields-row'));
        expect(2).toEqual(fieldRows.length);

        expect(2).toEqual(fieldRows[0].componentInstance.fieldRow.columns.length);
        expect(1).toEqual(fieldRows[0].componentInstance.fieldRow.columns[0].fields.length);

        expect(1).toEqual(fieldRows[1].componentInstance.fieldRow.columns.length);
        expect(1).toEqual(fieldRows[1].componentInstance.fieldRow.columns[0].fields.length);
    });

    it('should set dropped field if a drop event happen from source', () => {
        becomeNewField(fakeFields[8]);
        fixture.detectChanges();

        this.testFieldDragDropService._fieldDropFromSource.next({
            item: fakeFields[8],
            target: {
                columnId: '8',
                model: [fakeFields[8]]
            }
        });


        expect(fakeFields[8]).toBe(comp.formData);
    });

    it('should do drag and drop without throwing error', () => {
        fixture.detectChanges();
        hostComp.loading = false;
        fixture.detectChanges();
        expect(hostComp.loading).toBe(false);
    });


    it('should save all the fields (moving the last line to the top)', () => {
        spyOn(comp.saveFields, 'emit');

        fixture.detectChanges();

        const fieldMoved = [_.cloneDeep(comp.fieldRows[1]), _.cloneDeep(comp.fieldRows[0])];

        this.testFieldDragDropService._fieldRowDropFromTarget.next(fieldMoved);

        const expected = [fakeFields[5], fakeFields[0], fakeFields[1], fakeFields[2], fakeFields[3], fakeFields[4]].map(
            (fakeField, index) => {
                fakeField.sortOrder = index;
                return fakeField;
            }
        );
        expect(comp.saveFields.emit).toHaveBeenCalledWith(expected);
        expect(removeSortOrder(<FieldRow[]> comp.fieldRows)).toEqual(removeSortOrder(fieldMoved));
    });

    it('should save all the fields (moving just the last field)', () => {
        spyOn(comp.saveFields, 'emit');

        fixture.detectChanges();
        const fieldsMoved = moveFromSecondRowToFirstRowAndEmitEvent();

        fixture.detectChanges();

        let expectedIndex = 4;

        const expected = [fakeFields[8], fakeFields[4], fakeFields[5], fakeFields[6], fakeFields[7]].map(
            (fakeField) => {
                fakeField.sortOrder = expectedIndex++;
                return fakeField;
            }
        );

        expect(comp.saveFields.emit).toHaveBeenCalledWith(expected);
        expect(removeSortOrder(<FieldRow[]>  comp.fieldRows)).toEqual(removeSortOrder(fieldsMoved));
    });

    it('should save all the new fields', () => {

        let saveFields;

        becomeNewField(fakeFields[6]);
        becomeNewField(fakeFields[7]);
        becomeNewField(fakeFields[8]);

        fakeFields[7].id = 'ng-1';

        fixture.detectChanges();

        spyOn(comp.propertiesForm, 'destroy');

        // select the fields[8] as the current field
        this.testFieldDragDropService._fieldDropFromSource.next({
            item: fakeFields[8],
            target: {
                columnId: fakeFields[7].id ,
                model: [fakeFields[8]]
            }
        });

        comp.saveFields.subscribe((fields) => (saveFields = fields));
        comp.saveFieldsHandler(fakeFields[8]);

        const expected = [fakeFields[6], fakeFields[7], fakeFields[8]];
        expected[0].sortOrder = 6;
        expected[1].sortOrder = 7;
        expected[2].sortOrder = 8;

        expect(expected).toEqual(saveFields);
        expect(comp.propertiesForm.destroy).toHaveBeenCalled();
    });

    it('should save all updated fields', () => {
        let saveFields;

        fixture.detectChanges();
        comp.editField(fakeFields[8]);

        comp.saveFields.subscribe((fields) => {
            saveFields = fields;
        });

        const fieldUpdated = {
            fixed: true,
            indexed: true
        };

        comp.displayDialog = false;
        comp.saveFieldsHandler(fieldUpdated);

        const { fixed, indexed, ...original } = saveFields[0];

        expect(original).toEqual(fakeFields[8]);
        expect(saveFields[0].fixed).toEqual(true);
        expect(saveFields[0].indexed).toEqual(true);
        expect(comp.currentField).toEqual({
            fieldId: fakeFields[8].id,
            contentTypeId: fakeFields[8].contentTypeId
        });
    });

    it('should handler removeField event', () => {
        const field = {
            clazz: 'classField',
            name: 'nameField'
        };

        const spy = spyOn(comp, 'removeField');

        fixture.detectChanges();

        const fieldsContainer = de.query(By.css('.content-type-fields-drop-zone__container'));
        const fieldRows = fieldsContainer.queryAll(By.css('dot-content-type-fields-row'));
        fieldRows[0].componentInstance.removeField.emit(field);

        expect(spy).toHaveBeenCalledWith(field);
    });

    it('should create empty row and column when no fields present', () => {
        hostComp.fields = [];
        fixture.detectChanges();

        expect((<FieldRow>comp.fieldRows[0]).columns[0].fields.length).toEqual(0);
        expect((<FieldRow>comp.fieldRows[0]).columns[0].columnDivider.clazz).toEqual(
            'com.dotcms.contenttype.model.field.ImmutableColumnField'
        );
        expect(comp.fieldRows[0].getFieldDivider().clazz).toEqual(
            'com.dotcms.contenttype.model.field.ImmutableRowField'
        );
    });

    it('should disable field variable tab', () => {
        comp.formData = {};
        comp.displayDialog = true;
        fixture.detectChanges();

        const tabLinks = de.queryAll(By.css('.ui-tabview-nav li'));
        expect(tabLinks[1].nativeElement.classList.contains('ui-state-disabled')).toBe(true);
    });

    it('should NOT disable field variable tab', () => {
        comp.formData = {
            id: '123'
        };
        comp.displayDialog = true;
        fixture.detectChanges();

        const tabLinks = de.queryAll(By.css('.ui-tabview-nav li'));
        expect(tabLinks[1].nativeElement.classList.contains('ui-state-disabled')).toBe(false);
    });

    it('should add FieldRow when them does not exists into a TabDivider', () => {
        hostComp.fields = [
            {
                clazz: 'text',
                id: '1',
                name: 'field 1',
                sortOrder: 1,
                contentTypeId: '5b'
            },
            {
                clazz: 'com.dotcms.contenttype.model.field.ImmutableTabDividerField',
                id: '2',
                name: 'field 2',
                sortOrder: 2,
                contentTypeId: '6b'
            },
            {
                clazz: 'text',
                id: '3',
                name: 'field 3',
                sortOrder: 3,
                contentTypeId: '5b'
            },
        ];

        fixture.detectChanges();

        expect(comp.fieldRows.length).toEqual(3);
        expect(comp.fieldRows[0] instanceof FieldRow).toBeTruthy();
        expect(comp.fieldRows[1] instanceof FieldTab).toBeTruthy();
        expect(comp.fieldRows[2] instanceof FieldRow).toBeTruthy();
    });

    describe('Edit Field Dialog', () => {
        beforeEach(async(() => {
            fixture.detectChanges();

            this.testFieldDragDropService._fieldDropFromSource.next({
                item: fakeFields[7],
                target: {
                    columnId: '8',
                    model: [fakeFields[7]]
                }
            });

            fixture.detectChanges();
        }));

        it('should display dialog if a drop event happen from source', () => {

            expect(comp.displayDialog).toBe(true);
            const dialog = de.query(By.css('dot-dialog'));
            expect(dialog).not.toBeNull();
        });

        it('should set hideButtons to true when change to variable tab', () => {
            const tabView = de.query(By.css('p-tabView'));
            tabView.triggerEventHandler('onChange', {index: 1});

            fixture.detectChanges();
            expect(de.query(By.css('dot-dialog')).componentInstance.hideButtons).toEqual(true);
        });
    });

    describe('DotLoadingIndicator', () => {
        it('should have dot-loading-indicator', () => {
            fixture.detectChanges();

            const dotLoadingIndicator = de.query(By.css('dot-loading-indicator'));
            expect(dotLoadingIndicator).not.toBeNull();
            expect(dotLoadingIndicator.componentInstance.fullscreen).toBe(true);
        });

        it('Should show dot-loading-indicator when loading is set to true', () => {
            hostComp.loading = true;
            spyOn(dotLoadingIndicatorServiceMock, 'show');
            fixture.detectChanges();

            expect(dotLoadingIndicatorServiceMock.show).toHaveBeenCalled();
        });

        it('Should hide dot-loading-indicator when loading is set to true', () => {
            hostComp.loading = false;
            spyOn(dotLoadingIndicatorServiceMock, 'hide');
            fixture.detectChanges();

            expect(dotLoadingIndicatorServiceMock.hide).toHaveBeenCalled();
        });
    });
});
