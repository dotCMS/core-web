import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, SimpleChange } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import { ContentTypesFormComponent } from './content-types-form.component';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotcmsConfig, LoginService, SocketFactory } from 'dotcms-js/dotcms-js';
import { DropdownModule, OverlayPanelModule, ButtonModule, InputTextModule, TabViewModule } from 'primeng/primeng';
import { FieldValidationMessageModule } from '../../../view/components/_common/field-validation-message/file-validation-message.module';
import { LoginServiceMock } from '../../../test/login-service.mock';
import { DotMessageService } from '../../../api/services/dot-messages-service';
import { MockDotMessageService } from '../../../test/dot-message-service.mock';
import { ContentTypesInfoService } from '../../../api/services/content-types-info';
import { SiteSelectorFieldModule } from '../../../view/components/_common/site-selector-field/site-selector-field.module';
import { SiteService } from 'dotcms-js/dotcms-js';
import { SiteServiceMock } from '../../../test/site-service.mock';
import { WorkflowService } from '../../../api/services/workflow/workflow.service';
import { RouterTestingModule } from '@angular/router/testing';

class HotkeysServiceMock {
    add() {}
    get() {}
    remove() {}
}

describe('ContentTypesFormComponent', () => {
    let comp: ContentTypesFormComponent;
    let fixture: ComponentFixture<ContentTypesFormComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let dotcmsConfig: DotcmsConfig;
    let location: Location;

    beforeEach(
        async(() => {
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
                declarations: [ContentTypesFormComponent],
                imports: [
                    RouterTestingModule.withRoutes([{component: ContentTypesFormComponent, path: 'test'}]),
                    BrowserAnimationsModule,
                    ButtonModule,
                    DropdownModule,
                    FieldValidationMessageModule,
                    InputTextModule,
                    OverlayPanelModule,
                    ReactiveFormsModule,
                    TabViewModule,
                    SiteSelectorFieldModule,
                    RouterTestingModule
                ],
                providers: [
                    { provide: LoginService, useClass: LoginServiceMock },
                    { provide: DotMessageService, useValue: messageServiceMock },
                    { provide: HotkeysService, useClass: HotkeysServiceMock },
                    { provide: SiteService, useValue: siteServiceMock },
                    DotcmsConfig,
                    ContentTypesInfoService,
                    SocketFactory,
                    WorkflowService,
                    Location
                ]
            });

            fixture = DOTTestBed.createComponent(ContentTypesFormComponent);
            comp = fixture.componentInstance;
            de = fixture.debugElement.query(By.css('form'));
            el = de.nativeElement;

            dotcmsConfig = fixture.debugElement.injector.get(DotcmsConfig);
            location = fixture.debugElement.injector.get(Location);
        })
    );

    it('should open dialog by default', () => {
        expect(de.query(By.css('p-dialog'))).toBeDefined();
    });

    it('should be invalid by default', () => {
        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();
        expect(comp.form.valid).toBeFalsy();
    });

    it('should be valid when all name have value', () => {
        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        comp.form.get('name').setValue('content type name');
        expect(comp.form.valid).toBeTruthy();
    });

    it('should have name focus by default on create mode', () => {
        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();
        expect(comp.name.nativeElement).toBe(document.activeElement);
    });

    it('should have submit button disabled when form is invalid', () => {
        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        // Form is only valid when "name" property is set
        comp.form.get('description').setValue('hello world');
        fixture.detectChanges();

        const submittButton: DebugElement = fixture.debugElement.query(By.css('#content-type-form-submit'));
        expect(submittButton.nativeElement.disabled).toBeTruthy();
    });

    it('should have submit button enabled when form is valid', () => {
        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        // Form is only valid when "name" property is set
        comp.form.get('name').setValue('hello world');
        fixture.detectChanges();

        const submittButton: DebugElement = fixture.debugElement.query(By.css('#content-type-form-submit'));
        expect(submittButton.nativeElement.disabled).toBe(false);
    });

    it('should have submit button enabled when form is valid and the value change in edit mode', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World'
        };
        fixture.detectChanges();

        // Form is only valid when "name" property is set
        comp.form.get('name').setValue('A new name');
        fixture.detectChanges();

        const submittButton: DebugElement = fixture.debugElement.query(By.css('#content-type-form-submit'));
        expect(submittButton.nativeElement.disabled).toBe(false);
    });

    it('should have submit button disabled when form is invalid and the value change in edit mode', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World'
        };
        fixture.detectChanges();

        // Form is only valid when "name" property is set
        comp.form.get('name').setValue(null);
        comp.form.get('description').setValue('a description');
        fixture.detectChanges();

        const submittButton: DebugElement = fixture.debugElement.query(By.css('#content-type-form-submit'));
        expect(submittButton.nativeElement.disabled).toBe(true);
    });

    // tslint:disable-next-line:max-line-length
    it('should have the submit button disabled when the form value change and the gets back to the original content (no community license)', () => {
        spyOn(dotcmsConfig, 'getConfig').and.returnValue(
            Observable.of({
                license: { isCommunity: false }
            })
        );

        comp.data = {
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World'
        };
        fixture.detectChanges();

        const submittButton: DebugElement = fixture.debugElement.query(By.css('#content-type-form-submit'));

        expect(submittButton.nativeElement.disabled).toBe(true, 'by default button disabled');

        comp.form.get('name').setValue('A new  name');
        fixture.detectChanges();
        expect(submittButton.nativeElement.disabled).toBe(false, 'name updated button enabled');

        comp.form.get('name').setValue('Hello World');
        fixture.detectChanges();
        expect(submittButton.nativeElement.disabled).toBe(true, 'revert the change button disabled');
    });

    // tslint:disable-next-line:max-line-length
    it('should have the submit button disabled when the form value change and the gets back to the original content (community license)', () => {
        spyOn(dotcmsConfig, 'getConfig').and.returnValue(
            Observable.of({
                license: { isCommunity: true }
            })
        );

        comp.data = {
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World'
        };
        fixture.detectChanges();

        const submittButton: DebugElement = fixture.debugElement.query(By.css('#content-type-form-submit'));

        expect(submittButton.nativeElement.disabled).toBe(true, 'by default button disabled');

        comp.form.get('name').setValue('A new  name');
        fixture.detectChanges();
        expect(submittButton.nativeElement.disabled).toBe(false, 'name updated button enabled');

        comp.form.get('name').setValue('Hello World');
        fixture.detectChanges();
        expect(submittButton.nativeElement.disabled).toBe(true, 'revert the change button disabled');
    });

    it('should have submit button disabled after then form its submitted correctly', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World'
        };
        fixture.detectChanges();

        comp.form.get('name').setValue('a new name');
        expect(comp.form.valid).toEqual(true, 'make sure form is valid after update it');

        fixture.detectChanges();
        const editButton: DebugElement = fixture.debugElement.query(By.css('#form-edit-button'));
        editButton.nativeNode.click();

        // We trigger the reset as the parent (edit content type) does it.
        comp.resetForm();

        fixture.detectChanges();

        const submittButton: DebugElement = fixture.debugElement.query(By.css('#content-type-form-submit'));
        expect(submittButton.nativeElement.disabled).toBe(true, 'button should be disabled after update');
    });

    it('should have the submit button disabled when date fields updates', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World'
        };
        fixture.detectChanges();

        const submittButton: DebugElement = fixture.debugElement.query(By.css('#content-type-form-submit'));
        expect(submittButton.nativeElement.disabled).toBe(true, 'by default button disabled');

        const changes: SimpleChange = new SimpleChange(
            null,
            [
                {
                    clazz: 'com.dotcms.contenttype.model.field.ImmutableDateTimeField',
                    id: '123',
                    indexed: true,
                    name: 'Date 1'
                },
                {
                    clazz: 'com.dotcms.contenttype.model.field.ImmutableDateTimeField',
                    id: '456',
                    indexed: true,
                    name: 'Date 2'
                }
            ],
            false
        );

        comp.fields = changes.currentValue;
        comp.ngOnChanges({
            fields: changes
        });
        fixture.detectChanges();

        expect(submittButton.nativeElement.disabled).toBe(true, 'button should remain disabled');
    });

    it('should have the submit button disabled when edit a content with fields', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World'
        };
        comp.fields = [
            {
                clazz: 'com.dotcms.contenttype.model.field.ImmutableDateTimeField',
                id: '123',
                indexed: true,
                name: 'Date 1'
            },
            {
                clazz: 'com.dotcms.contenttype.model.field.ImmutableDateTimeField',
                id: '456',
                indexed: true,
                name: 'Date 2'
            }
        ];
        fixture.detectChanges();

        const submittButton: DebugElement = fixture.debugElement.query(By.css('#content-type-form-submit'));

        expect(submittButton.nativeElement.disabled).toBe(true);
    });

    it('should have cancel button on edit mode', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        const cancelButton: DebugElement = fixture.debugElement.query(By.css('#content-type-form-cancel'));
        expect(cancelButton).not.toBeNull();
    });

    it('should have edit button on edit mode', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();
        const editButton: DebugElement = fixture.debugElement.query(By.css('#form-edit-button'));
        expect(editButton.nativeElement.disabled).toBe(false);
        expect(editButton).toBeTruthy();
    });

    it('should have Create content type title and Create action on create mode', () => {
        comp.data = {
            baseType: ''
        };
        fixture.detectChanges();
        const dialogTitle: DebugElement = fixture.debugElement.query(By.css('p-header'));
        expect(dialogTitle).toBeTruthy();

        const submitAction: DebugElement = fixture.debugElement.query(By.css('#content-type-form-submit'));
        expect(submitAction).toBeTruthy();

        expect(dialogTitle.nativeElement.innerText).toEqual('Create content type');
        expect(submitAction.nativeElement.innerText).toEqual('Create');
    });

    it('should have Edit content type title and Update action on edit mode', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();
        const dialogTitle: DebugElement = fixture.debugElement.query(By.css('p-header'));
        expect(dialogTitle).toBeTruthy();

        const submitAction: DebugElement = fixture.debugElement.query(By.css('#content-type-form-submit'));
        expect(submitAction).toBeTruthy();

        expect(dialogTitle.nativeElement.innerText).toEqual('Edit content type');
        expect(submitAction.nativeElement.innerText).toEqual('Update');
    });

    it('should call cancelForm() on cancel button click and call location.back', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        spyOn(comp, 'cancelForm').and.callThrough();
        spyOn(location, 'back');

        fixture.detectChanges();

        const cancelButton: DebugElement = fixture.debugElement.query(By.css('#content-type-form-cancel'));
        expect(cancelButton).toBeDefined();

        cancelButton.nativeElement.click();

        expect(comp.cancelForm).toHaveBeenCalledTimes(1);
        expect(location.back).toHaveBeenCalledTimes(1);
    });

    it('should reset the form value on cancel button click', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World',
            description: 'Hello Description',
            clazz: 'clazz'
        };
        fixture.detectChanges();

        comp.form.get('name').setValue('a new name');
        comp.form.get('description').setValue('a new desc');

        expect(comp.form.value).toEqual({
            clazz: 'clazz',
            description: 'a new desc',
            detailPage: '',
            host: '',
            name: 'a new name',
            urlMapPattern: '',
            defaultType: null,
            fixed: null,
            folder: null,
            system: null
        });

        const cancelButton: DebugElement = fixture.debugElement.query(By.css('#content-type-form-cancel'));
        cancelButton.nativeNode.click();
        fixture.detectChanges();

        expect(comp.form.value).toEqual({
            clazz: 'clazz',
            description: 'Hello Description',
            detailPage: '',
            host: '',
            name: 'Hello World',
            urlMapPattern: '',
            defaultType: null,
            fixed: null,
            folder: null,
            system: null
        });
    });

    it('should call submitContent() on submit event', () => {
        spyOn(comp, 'submitContent');
        comp.data = {
            baseType: 'CONTENT',
            id: '123',
            name: 'Hello World'
        };
        fixture.detectChanges();

        const form = fixture.debugElement.query(By.css('form'));
        form.nativeElement.dispatchEvent(new Event('submit'));

        expect(comp.submitContent).toHaveBeenCalledTimes(1);
    });

    it('should have basic form controls for non-content base types', () => {
        comp.data = {
            baseType: 'WIDGET'
        };
        fixture.detectChanges();

        expect(Object.keys(comp.form.controls).length).toBe(11);
        expect(comp.form.get('clazz')).not.toBeNull();
        expect(comp.form.get('name')).not.toBeNull();
        expect(comp.form.get('host')).not.toBeNull();
        expect(comp.form.get('description')).not.toBeNull();
        expect(comp.form.get('workflow')).not.toBeNull();
        expect(comp.form.get('publishDateVar')).not.toBeNull();
        expect(comp.form.get('expireDateVar')).not.toBeNull();
        expect(comp.form.get('defaultType')).not.toBeNull();
        expect(comp.form.get('fixed')).not.toBeNull();
        expect(comp.form.get('system')).not.toBeNull();
        expect(comp.form.get('folder')).not.toBeNull();

        expect(comp.form.get('detailPage')).toBeNull();
        expect(comp.form.get('urlMapPattern')).toBeNull();
    });

    it('should render basic fields for non-content base types', () => {
        comp.data = {
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

        fields.forEach(field => {
            expect(fixture.debugElement.query(By.css(field))).not.toBeNull();
        });
    });

    it('should have basic form controls for content base type', () => {
        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        expect(Object.keys(comp.form.controls).length).toBe(13);
        expect(comp.form.get('clazz')).not.toBeNull();
        expect(comp.form.get('name')).not.toBeNull();
        expect(comp.form.get('host')).not.toBeNull();
        expect(comp.form.get('description')).not.toBeNull();
        expect(comp.form.get('workflow')).not.toBeNull();
        expect(comp.form.get('publishDateVar')).not.toBeNull();
        expect(comp.form.get('expireDateVar')).not.toBeNull();
        expect(comp.form.get('detailPage')).not.toBeNull();
        expect(comp.form.get('urlMapPattern')).not.toBeNull();
        expect(comp.form.get('defaultType')).not.toBeNull();
        expect(comp.form.get('fixed')).not.toBeNull();
        expect(comp.form.get('system')).not.toBeNull();
        expect(comp.form.get('folder')).not.toBeNull();
    });

    it('should render extra fields for content types', () => {
        comp.data = {
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

        fields.forEach(field => {
            expect(fixture.debugElement.query(By.css(field))).not.toBeNull();
        });
    });

    it('should show workflow disabled and with message if the license community its true', () => {
        spyOn(dotcmsConfig, 'getConfig').and.returnValue(
            Observable.of({
                license: { isCommunity: true }
            })
        );

        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        const workflowMsg = de.query(By.css('#field-workflow-hint'));
        expect(workflowMsg).toBeTruthy();
        expect(comp.form.get('workflow').disabled).toBeTruthy();
    });

    it('should show workflow enable and no message if the license community its false', () => {
        spyOn(dotcmsConfig, 'getConfig').and.returnValue(
            Observable.of({
                license: { isCommunity: false }
            })
        );

        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        const workflowMsg = de.query(By.css('#field-workflow-hint'));
        expect(workflowMsg).toBeFalsy();
        expect(comp.form.get('workflow').disabled).toBeFalsy();
    });

    it('should call the WorkFlow endpoint if the license community its false', () => {
        let workflowService: WorkflowService = fixture.debugElement.injector.get(WorkflowService);
        spyOn(dotcmsConfig, 'getConfig').and.returnValue(
            Observable.of({
                license: { isCommunity: false }
            })
        );
        spyOn(workflowService, 'get').and.returnValue(Observable.of([{'id': '123'}]));
        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();
        expect(workflowService.get).toHaveBeenCalled();
    });

    it('should render disabled dates fields and hint when date fields are not passed', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        const dateFieldMsg = de.query(By.css('#field-dates-hint'));

        expect(dateFieldMsg).toBeTruthy();
        expect(comp.form.get('publishDateVar').disabled).toBe(true);
        expect(comp.form.get('expireDateVar').disabled).toBe(true);
    });

    it('should render enabled dates fields when date fields are passed', () => {
        comp.data = {
            baseType: 'CONTENT'
        };
        comp.fields = [
            {
                clazz: 'com.dotcms.contenttype.model.field.ImmutableDateTimeField',
                id: '123',
                indexed: true,
                name: 'Date 1'
            },
            {
                clazz: 'com.dotcms.contenttype.model.field.ImmutableDateTimeField',
                id: '456',
                indexed: true,
                name: 'Date 2'
            }
        ];
        fixture.detectChanges();

        expect(comp.form.get('publishDateVar').disabled).toBe(false);
        expect(comp.form.get('expireDateVar').disabled).toBe(false);
    });

    it('should update date var fields from disable to enable when date fields are passed', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        expect(comp.form.get('publishDateVar').disabled).toBe(true);
        expect(comp.form.get('expireDateVar').disabled).toBe(true);

        comp.fields = [
            {
                clazz: 'com.dotcms.contenttype.model.field.ImmutableDateTimeField',
                id: '123',
                indexed: true,
                name: 'Date 1'
            },
            {
                clazz: 'com.dotcms.contenttype.model.field.ImmutableDateTimeField',
                id: '456',
                indexed: true,
                name: 'Date 2'
            }
        ];

        comp.ngOnChanges({
            fields: new SimpleChange(null, comp.fields, false)
        });

        expect(comp.form.get('publishDateVar').disabled).toBe(false);
        expect(comp.form.get('expireDateVar').disabled).toBe(false);
    });

    it('should not send data with invalid form', () => {
        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        let data = null;
        spyOn(comp, 'submitContent').and.callThrough();

        comp.onSubmit.subscribe(res => (data = res));
        const submitFormButton: DebugElement = fixture.debugElement.query(By.css('#content-type-form-submit'));
        submitFormButton.nativeElement.click();

        expect(comp.submitContent).not.toHaveBeenCalled();
        expect(data).toBeNull();
    });

    it('should send data with valid form', () => {
        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        let data = null;
        spyOn(comp, 'submitContent').and.callThrough();

        comp.onSubmit.subscribe(res => (data = res));

        comp.form.controls.name.setValue('A content type name');

        fixture.detectChanges();

        const submitFormButton: DebugElement = fixture.debugElement.query(By.css('#content-type-form-submit'));
        submitFormButton.nativeElement.click();

        expect(comp.submitContent).toHaveBeenCalledTimes(1);
        expect(data).toEqual({
            clazz: '',
            description: '',
            detailPage: '',
            host: '',
            name: 'A content type name',
            urlMapPattern: '',
            defaultType: null,
            fixed: null,
            folder: null,
            system: null
        });
    });
});
