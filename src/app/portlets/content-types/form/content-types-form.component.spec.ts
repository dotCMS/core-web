import { of as observableOf, Observable } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, Injectable, Component, Input, forwardRef } from '@angular/core';
import {
    ReactiveFormsModule,
    AbstractControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import {
    DropdownModule,
    OverlayPanelModule,
    ButtonModule,
    InputTextModule,
    TabViewModule
} from 'primeng/primeng';

import { DOTTestBed } from '@tests/dot-test-bed';
import { LoginServiceMock } from '@tests/login-service.mock';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { SiteServiceMock } from '@tests/site-service.mock';
import { DotWorkflowServiceMock, mockWorkflows } from '@tests/dot-workflow-service.mock';

import { DotcmsConfig, LoginService } from 'dotcms-js';
import { SiteService } from 'dotcms-js';

import { ContentTypesFormComponent } from './content-types-form.component';
import { DotSystemActionType, DotCMSContentType } from 'dotcms-models';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { DotMessageService } from '@services/dot-messages-service';
import { ContentTypesInfoService } from '@services/content-types-info';
import { DotWorkflowService } from '@services/dot-workflow/dot-workflow.service';
// tslint:disable-next-line:max-line-length
import { DotWorkflowsSelectorFieldModule } from '@components/_common/dot-workflows-selector-field/dot-workflows-selector-field.module';

import { DotLicenseService } from '@services/dot-license/dot-license.service';
import { DotPageSelectorModule } from '@components/_common/dot-page-selector/dot-page-selector.module';
import { DotDirectivesModule } from '@shared/dot-directives.module';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';
import { MdInputTextModule } from '@directives/md-inputtext/md-input-text.module';
import { DotFieldHelperModule } from '@components/dot-field-helper/dot-field-helper.module';
import { DotCMSContentTypeLayoutRow } from 'dotcms-models';
import {
    dotcmsContentTypeFieldBasicMock,
    dotcmsContentTypeBasicMock
} from '@tests/dot-content-types.mock';
import { DotWorkflowsActionsSelectorFieldModule } from '@components/_common/dot-workflows-actions-selector-field/dot-workflows-actions-selector-field.module';

@Component({
    selector: 'dot-site-selector-field',
    template: '',
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotSiteSelectorComponent)
        }
    ]
})
class DotSiteSelectorComponent implements ControlValueAccessor {
    @Input() system;

    writeValue() {}

    registerOnChange() {}

    registerOnTouched() {}
}

@Injectable()
class MockDotLicenseService {
    isEnterprise(): Observable<boolean> {
        return observableOf(false);
    }
}

describe('ContentTypesFormComponent', () => {
    let comp: ContentTypesFormComponent;
    let fixture: ComponentFixture<ContentTypesFormComponent>;
    let de: DebugElement;
    let dotLicenseService: DotLicenseService;
    const layout: DotCMSContentTypeLayoutRow[] = [
        {
            divider: {
                ...dotcmsContentTypeFieldBasicMock,
                clazz: 'com.dotcms.contenttype.model.field.ImmutableRowField',
                name: 'row_field'
            },
            columns: [
                {
                    columnDivider: {
                        ...dotcmsContentTypeFieldBasicMock,
                        clazz: 'com.dotcms.contenttype.model.field.ImmutableColumnField',
                        name: 'column_field'
                    },
                    fields: [
                        {
                            ...dotcmsContentTypeFieldBasicMock,
                            clazz: 'com.dotcms.contenttype.model.field.ImmutableDateTimeField',
                            id: '123',
                            indexed: true,
                            name: 'Date 1'
                        },
                        {
                            ...dotcmsContentTypeFieldBasicMock,
                            clazz: 'com.dotcms.contenttype.model.field.ImmutableDateTimeField',
                            id: '456',
                            indexed: true,
                            name: 'Date 2'
                        }
                    ]
                }
            ]
        }
    ];

    beforeEach(async(() => {
        const messageServiceMock = new MockDotMessageService({
            'contenttypes.form.field.detail.page': 'Detail Page',
            'contenttypes.form.field.expire.date.field': 'Expire Date Field',
            'contenttypes.form.field.host_folder.label': 'Host or Folder',
            'contenttypes.form.identifier': 'Identifier',
            'contenttypes.form.label.publish.date.field': 'Publish Date Field',
            'contenttypes.hint.URL.map.pattern.hint1': 'Hello World',
            'contenttypes.form.label.URL.pattern': 'URL Pattern',
            'contenttypes.content.variable': 'Variable',
            'contenttypes.form.label.workflow': 'Workflow',
            'contenttypes.action.cancel': 'Cancel',
            'contenttypes.form.label.description': 'Description',
            'contenttypes.form.name': 'Name',
            'contenttypes.action.save': 'Save',
            'contenttypes.action.update': 'Update',
            'contenttypes.action.create': 'Create',
            'contenttypes.action.edit': 'Edit',
            'contenttypes.action.delete': 'Delete',
            'contenttypes.form.name.error.required': 'Error is wrong',
            'contenttypes.action.form.cancel': 'Cancel',
            'contenttypes.content.contenttype': 'content type',
            'contenttypes.content.fileasset': 'fileasset',
            'contenttypes.content.content': 'Content',
            'contenttypes.content.form': 'Form',
            'contenttypes.content.persona': 'Persona',
            'contenttypes.content.widget': 'Widget',
            'contenttypes.content.htmlpage': 'Page',
            'contenttypes.content.key_value': 'Key Value',
            'contenttypes.content.vanity_url:': 'Vanity Url'
        });

        const siteServiceMock = new SiteServiceMock();

        DOTTestBed.configureTestingModule({
            declarations: [ContentTypesFormComponent, DotSiteSelectorComponent],
            imports: [
                RouterTestingModule.withRoutes([
                    { component: ContentTypesFormComponent, path: 'test' }
                ]),
                BrowserAnimationsModule,
                ButtonModule,
                DotDirectivesModule,
                DotFieldHelperModule,
                DotFieldValidationMessageModule,
                DotIconButtonModule,
                DotIconModule,
                DotPageSelectorModule,
                DotWorkflowsActionsSelectorFieldModule,
                DotWorkflowsSelectorFieldModule,
                DropdownModule,
                InputTextModule,
                MdInputTextModule,
                OverlayPanelModule,
                ReactiveFormsModule,
                RouterTestingModule,
                TabViewModule
            ],
            providers: [
                { provide: LoginService, useClass: LoginServiceMock },
                { provide: DotMessageService, useValue: messageServiceMock },
                { provide: SiteService, useValue: siteServiceMock },
                { provide: DotWorkflowService, useClass: DotWorkflowServiceMock },
                { provide: DotLicenseService, useClass: MockDotLicenseService },
                DotcmsConfig,
                ContentTypesInfoService
            ]
        });

        fixture = DOTTestBed.createComponent(ContentTypesFormComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        dotLicenseService = de.injector.get(DotLicenseService);
    }));

    it('should be invalid by default', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT'
        };
        fixture.detectChanges();
        expect(comp.form.valid).toBe(false);
    });

    it('should be valid when name field have value', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        comp.form.get('name').setValue('content type name');
        expect(comp.form.valid).toBe(true);
    });

    it('should have name focus by default on create mode', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT'
        };
        fixture.detectChanges();
        expect(comp.name.nativeElement).toBe(document.activeElement);
    });

    it('should have canSave property false by default (form is invalid)', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        expect(comp.canSave).toBe(false);
    });

    it('should set canSave property true form is valid', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            name: 'hello',
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        // Form is only valid when "name" property is set
        comp.form.get('description').setValue('hello world');
        fixture.detectChanges();

        expect(comp.canSave).toBe(true);
    });

    it('should set canSave property false when form is invalid in edit mode', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World'
        };
        fixture.detectChanges();

        comp.form.get('name').setValue(null);
        fixture.detectChanges();

        expect(comp.canSave).toBe(false);
    });

    it('should set canSave property true when form is valid and model updated in edit mode', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World'
        };
        fixture.detectChanges();

        comp.form.get('description').setValue('some desc');
        fixture.detectChanges();

        expect(comp.canSave).toBe(true);
    });

    it('should set canSave property false when form is invalid and model updated in edit mode', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World'
        };
        fixture.detectChanges();

        comp.form.get('name').setValue(null);
        comp.form.get('description').setValue('some desc');
        fixture.detectChanges();

        expect(comp.canSave).toBe(false);
    });

    // tslint:disable-next-line:max-line-length
    it('should set canSave property false when the form value is updated and then gets back to the original content (no community license)', () => {
        spyOn(dotLicenseService, 'isEnterprise').and.returnValue(observableOf(false));

        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World'
        };
        fixture.detectChanges();
        expect(comp.canSave).toBe(false, 'by default is false');

        comp.form.get('name').setValue('A new  name');
        fixture.detectChanges();
        expect(comp.canSave).toBe(true, 'name updated set it to true');

        comp.form.get('name').setValue('Hello World');
        fixture.detectChanges();
        expect(comp.canSave).toBe(false, 'revert the change button disabled set it to false');
    });

    // tslint:disable-next-line:max-line-length
    it('should set canSave property false when the form value is updated and then gets back to the original content (community license)', () => {
        spyOn(dotLicenseService, 'isEnterprise').and.returnValue(observableOf(true));

        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World'
        };
        fixture.detectChanges();
        expect(comp.canSave).toBe(false, 'by default is false');

        comp.form.get('name').setValue('A new  name');
        fixture.detectChanges();
        expect(comp.canSave).toBe(true, 'name updated set it to true');

        comp.form.get('name').setValue('Hello World');
        fixture.detectChanges();
        expect(comp.canSave).toBe(false, 'revert the change button disabled set it to false');
    });

    it('should set canSave property false when edit a content with fields', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World'
        };
        comp.layout = layout;

        fixture.detectChanges();
        expect(comp.canSave).toBe(false, 'by default is false');
    });

    it('should set canSave property false on edit mode', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        expect(comp.canSave).toBe(false);
    });

    it('should have basic form controls for non-content base types', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'WIDGET'
        };
        fixture.detectChanges();

        expect(Object.keys(comp.form.controls).length).toBe(12);
        expect(comp.form.get('clazz')).not.toBeNull();
        expect(comp.form.get('name')).not.toBeNull();
        expect(comp.form.get('host')).not.toBeNull();
        expect(comp.form.get('description')).not.toBeNull();
        expect(comp.form.get('workflows')).not.toBeNull();
        expect(comp.form.get('publishDateVar')).not.toBeNull();
        expect(comp.form.get('expireDateVar')).not.toBeNull();
        expect(comp.form.get('defaultType')).not.toBeNull();
        expect(comp.form.get('fixed')).not.toBeNull();
        expect(comp.form.get('system')).not.toBeNull();
        expect(comp.form.get('folder')).not.toBeNull();
        const workflowAction = comp.form.get('systemActionMap');
        expect(workflowAction.get(DotSystemActionType.NEW)).not.toBeNull();

        expect(comp.form.get('detailPage')).toBeNull();
        expect(comp.form.get('urlMapPattern')).toBeNull();
    });

    it('should render basic fields for non-content base types', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'WIDGET'
        };
        fixture.detectChanges();

        const fields = [
            '#content-type-form-description',
            '#content-type-form-host',
            '#content-type-form-name',
            '#content-type-form-workflow',
            '#content-type-form-publish-date-field',
            '#content-type-form-expire-date-field'
        ];

        fields.forEach((field) => {
            expect(fixture.debugElement.query(By.css(field))).not.toBeNull();
        });
    });

    it('should have basic form controls for content base type', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        expect(Object.keys(comp.form.controls).length).toBe(14);
        expect(comp.form.get('clazz')).not.toBeNull();
        expect(comp.form.get('name')).not.toBeNull();
        expect(comp.form.get('host')).not.toBeNull();
        expect(comp.form.get('description')).not.toBeNull();
        expect(comp.form.get('workflows')).not.toBeNull();
        expect(comp.form.get('publishDateVar')).not.toBeNull();
        expect(comp.form.get('expireDateVar')).not.toBeNull();
        expect(comp.form.get('detailPage')).not.toBeNull();
        expect(comp.form.get('urlMapPattern')).not.toBeNull();
        expect(comp.form.get('defaultType')).not.toBeNull();
        expect(comp.form.get('fixed')).not.toBeNull();
        expect(comp.form.get('system')).not.toBeNull();
        expect(comp.form.get('folder')).not.toBeNull();

        const workflowAction = comp.form.get('systemActionMap');
        expect(workflowAction.get(DotSystemActionType.NEW)).not.toBeNull();
    });

    it('should set value to the form', () => {
        spyOn(dotLicenseService, 'isEnterprise').and.returnValue(observableOf(true));

        const fakeData: DotCMSContentType = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT',
            clazz: 'clazz',
            defaultType: false,
            description: 'description',
            detailPage: 'detail-page',
            expireDateVar: 'expireDateVar',
            fixed: false,
            folder: 'SYSTEM_FOLDER',
            host: 'host-id',
            id: '123',
            name: 'name',
            publishDateVar: 'publishDateVar',
            system: false,
            urlMapPattern: '/url/map',
            workflows: [
                {
                    ...mockWorkflows[0],
                    id: 'workflow-id'
                }
            ],
            systemActionMappings: {
                [DotSystemActionType.NEW]: ''
            }
        };

        comp.data = fakeData;
        comp.layout = layout;

        fixture.detectChanges();

        const { id, baseType, workflows, ...formValue } = fakeData;
        formValue['workflows'] = [
            {
                id: 'workflow-id'
            }
        ];
        expect(comp.form.value).toEqual(formValue);
    });

    it('should render extra fields for content types', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        const fields = [
            '#content-type-form-description',
            '#content-type-form-detail-page',
            '#content-type-form-host',
            '#content-type-form-name',
            '#content-type-form-url-map-pattern',
            '#content-type-form-workflow',
            '#content-type-form-detail-page',
            '#content-type-form-url-map-pattern'
        ];

        fields.forEach((field) => {
            expect(fixture.debugElement.query(By.css(field))).not.toBeNull();
        });
    });

    it('should render disabled dates fields and hint when date fields are not passed', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        const dateFieldMsg = de.query(By.css('#field-dates-hint'));

        expect(dateFieldMsg).toBeTruthy();
        expect(comp.form.get('publishDateVar').disabled).toBe(true);
        expect(comp.form.get('expireDateVar').disabled).toBe(true);
    });

    describe('fields dates enabled', () => {
        beforeEach(() => {
            comp.data = {
                ...dotcmsContentTypeBasicMock,
                baseType: 'CONTENT'
            };
            comp.layout = layout;
            fixture.detectChanges();
        });

        it('should render enabled dates fields when date fields are passed', () => {
            expect(comp.form.get('publishDateVar').disabled).toBe(false);
            expect(comp.form.get('expireDateVar').disabled).toBe(false);
        });

        it('should patch publishDateVar', () => {
            const field: AbstractControl = comp.form.get('publishDateVar');
            field.setValue('123');

            const expireDateVarField = de.query(By.css('#content-type-form-expire-date-field'));
            expireDateVarField.triggerEventHandler('onChange', { value: '123' });

            expect(field.value).toBe('');
        });

        it('should patch expireDateVar', () => {
            const field: AbstractControl = comp.form.get('expireDateVar');

            field.setValue('123');

            const expireDateVarField = de.query(By.css('#content-type-form-publish-date-field'));
            expireDateVarField.triggerEventHandler('onChange', { value: '123' });

            expect(field.value).toBe('');
        });
    });

    it('should not submit form with invalid form', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        let data = null;
        spyOn(comp, 'submitForm').and.callThrough();

        comp.onSubmit.subscribe((res) => (data = res));
        comp.submitForm();

        expect(data).toBeNull();
    });

    it('should not submit a valid form without changes and in Edit mode', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT',
            id: '123'
        };
        comp.layout = layout;
        fixture.detectChanges();
        spyOn(comp, 'submitForm').and.callThrough();
        spyOn(comp.onSubmit, 'emit');

        comp.submitForm();

        expect(comp.onSubmit.emit).not.toHaveBeenCalled();
    });

    it('should have dot-page-selector component and right attrs', () => {
        comp.data = {
            ...dotcmsContentTypeBasicMock,
            baseType: 'CONTENT',
            host: '123'
        };
        fixture.detectChanges();

        const pageSelector: DebugElement = de.query(By.css('dot-page-selector'));
        expect(pageSelector !== null).toBe(true);
        expect(pageSelector.componentInstance.label).toEqual('Detail Page');
        expect(pageSelector.componentInstance.floatingLabel).toBe(true);
        expect(pageSelector.componentInstance.style).toEqual({ width: '100%' });
    });

    describe('send data with valid form', () => {
        let data;

        beforeEach(() => {
            spyOn(dotLicenseService, 'isEnterprise').and.returnValue(observableOf(true));
            comp.data = {
                ...dotcmsContentTypeBasicMock,
                baseType: 'CONTENT'
            };
            fixture.detectChanges();
            data = null;
            spyOn(comp, 'submitForm').and.callThrough();
            comp.onSubmit.subscribe((res) => (data = res));
            comp.form.controls.name.setValue('A content type name');
            fixture.detectChanges();
        });

        it('should submit form correctly', () => {
            comp.submitForm();

            expect(data).toEqual({
                clazz: '',
                description: '',
                host: '',
                defaultType: false,
                fixed: false,
                folder: null,
                system: false,
                name: 'A content type name',
                workflows: [
                    {
                        id: 'd61a59e1-a49c-46f2-a929-db2b4bfa88b2',
                        creationDate: jasmine.any(Date),
                        name: 'System Workflow',
                        description: '',
                        archived: false,
                        mandatory: false,
                        defaultScheme: false,
                        modDate: jasmine.any(Date),
                        entryActionId: null,
                        system: true
                    }
                ],
                systemActionMap: { NEW: '' },
                detailPage: '',
                urlMapPattern: ''
            });
        });
    });

    describe('workflow field', () => {
        describe('create', () => {
            beforeEach(() => {
                comp.data = {
                    ...dotcmsContentTypeBasicMock,
                    baseType: 'CONTENT'
                };
            });

            describe('community license true', () => {
                beforeEach(() => {
                    spyOn(dotLicenseService, 'isEnterprise').and.returnValue(observableOf(false));
                    fixture.detectChanges();
                });

                it('should show workflow disabled and with message if the license community its true', () => {
                    const workflowMsg = de.query(By.css('#field-workflow-hint'));
                    expect(workflowMsg).toBeDefined();
                    expect(comp.form.get('workflows').disabled).toBe(true);
                    expect(
                        comp.form.get('systemActionMap').get(DotSystemActionType.NEW).disabled
                    ).toBe(true);
                });
            });

            describe('community license true', () => {
                beforeEach(() => {
                    spyOn(dotLicenseService, 'isEnterprise').and.returnValue(observableOf(true));
                    fixture.detectChanges();
                });

                it('should show workflow enable and no message if the license community its false', () => {
                    const workflowMsg = de.query(By.css('#field-workflow-hint'));
                    expect(workflowMsg).toBeDefined();
                    expect(comp.form.get('workflows').disabled).toBe(false);
                    expect(
                        comp.form.get('systemActionMap').get(DotSystemActionType.NEW).disabled
                    ).toBe(false);
                });
            });
        });

        describe('edit', () => {
            it('should set values from the server', () => {
                comp.data = {
                    ...dotcmsContentTypeBasicMock,
                    baseType: 'CONTENT',
                    id: '123',
                    workflows: [
                        {
                            ...mockWorkflows[0],
                            id: '123',
                            name: 'Workflow 1'
                        },
                        {
                            ...mockWorkflows[1],
                            id: '456',
                            name: 'Workflow 2'
                        }
                    ]
                };
                spyOn(dotLicenseService, 'isEnterprise').and.returnValue(observableOf(false));
                fixture.detectChanges();
                expect(comp.form.get('workflows').value).toEqual([
                    {
                        ...mockWorkflows[0],
                        id: '123',
                        name: 'Workflow 1'
                    },
                    {
                        ...mockWorkflows[1],
                        id: '456',
                        name: 'Workflow 2'
                    }
                ]);
            });

            it('should set empty value', () => {
                comp.data = {
                    ...dotcmsContentTypeBasicMock,
                    baseType: 'CONTENT',
                    id: '123'
                };
                spyOn(dotLicenseService, 'isEnterprise').and.returnValue(observableOf(false));
                fixture.detectChanges();
                expect(comp.form.get('workflows').value).toEqual([]);
            });
        });
    });
});
