import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, SimpleChange } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { ContentTypesFormComponent } from './content-types-form.component';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotcmsConfig, LoginService, SocketFactory } from 'dotcms-js/dotcms-js';
import {
    DropdownModule,
    OverlayPanelModule,
    ButtonModule,
    InputTextModule,
    TabViewModule
} from 'primeng/primeng';
import { FieldValidationMessageModule } from '../../../view/components/_common/field-validation-message/file-validation-message.module';
import { LoginServiceMock } from '../../../test/login-service.mock';
import { MessageService } from '../../../api/services/messages-service';
import { MockMessageService } from '../../../test/message-service.mock';
import { SiteSelectorModule } from '../../../view/components/_common/site-selector/site-selector.module';
import { ContentTypesInfoService } from '../../../api/services/content-types-info';
import { HotkeysService } from 'angular2-hotkeys';

class HotkeysServiceMock {
    add() {}
    remove() {}
}

describe('ContentTypesFormComponent', () => {
    let comp: ContentTypesFormComponent;
    let fixture: ComponentFixture<ContentTypesFormComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(
        async(() => {
            const messageServiceMock = new MockMessageService({
                'contenttypes.form.field.detail.page': 'Detail Page',
                'contenttypes.form.field.expire.date.field':
                    'Expire Date Field',
                'contenttypes.form.field.host_folder.label': 'Host or Folder',
                'contenttypes.form.identifier': 'Identifier',
                'contenttypes.form.label.publish.date.field':
                    'Publish Date Field',
                'contenttypes.hint.URL.map.pattern.hint1': 'Hello World',
                'contenttypes.form.label.URL.pattern': 'URL Pattern',
                'contenttypes.content.variable': 'Variable',
                'contenttypes.form.label.workflow': 'Workflow',
                'contenttypes.action.cancel': 'Cancel',
                'contenttypes.form.label.description': 'Description',
                'contenttypes.form.name': 'Name',
                'contenttypes.action.save': 'Save',
                'contenttypes.action.update': 'Update'
            });

            DOTTestBed.configureTestingModule({
                declarations: [ContentTypesFormComponent],
                imports: [
                    BrowserAnimationsModule,
                    ButtonModule,
                    DropdownModule,
                    FieldValidationMessageModule,
                    InputTextModule,
                    OverlayPanelModule,
                    ReactiveFormsModule,
                    TabViewModule,
                    SiteSelectorModule
                ],
                providers: [
                    { provide: LoginService, useClass: LoginServiceMock },
                    { provide: MessageService, useValue: messageServiceMock },
                    { provide: HotkeysService, useClass: HotkeysServiceMock },
                    DotcmsConfig,
                    ContentTypesInfoService,
                    SocketFactory
                ]
            });

            fixture = DOTTestBed.createComponent(ContentTypesFormComponent);
            comp = fixture.componentInstance;
            de = fixture.debugElement.query(By.css('form'));
            el = de.nativeElement;

            const changes: SimpleChange = new SimpleChange(null, null, true);
            comp.ngOnChanges({
                data: changes
            });
        })
    );

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

    it('should be collapsed by default in edit mode', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        const form = de.query(By.css('.content-type__full-form'));

        expect(comp.formState).toBe('collapsed', 'form state collapsed');
        expect(form.nativeElement.style.height).toBe('0px', 'form height 0');
        expect(form.nativeElement.style.overflow).toBe(
            'hidden',
            'form overflow hidden'
        );
    });

    it('should be expanded by default in create mode', () => {
        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        const form = de.query(By.css('.content-type__full-form'));

        expect(comp.formState).toBe('expanded', 'form state expanded');
        expect(form.nativeElement.style.height).toBe(
            '',
            'form height not set to be auto'
        );
        expect(form.nativeElement.style.overflow).toBe(
            'visible',
            'form overflow visible'
        );
    });

    it('should have submit button disabled when form is invalid', () => {
        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        // Form is only valid when "name" property is set
        comp.form.get('description').setValue('hello world');
        fixture.detectChanges();

        const submittButton: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-submit')
        );
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

        const submittButton: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-submit')
        );
        expect(submittButton.nativeElement.disabled).toBeFalsy();
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

        const submittButton: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-submit')
        );
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

        const submittButton: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-submit')
        );
        expect(submittButton.nativeElement.disabled).toBe(true);
    });

    it('should not have cancel button on create mode', () => {
        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        const cancelButton: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-cancel')
        );
        expect(cancelButton).toBeFalsy();
    });

    it('should have cancel button on edit mode', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        const cancelButton: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-cancel')
        );
        expect(cancelButton).not.toBeNull();
    });

    it('should have edit button on edit mode', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();
        const editButton: DebugElement = fixture.debugElement.query(
            By.css('#form-edit-button')
        );
        expect(editButton).toBeTruthy();
    });

    it('should call toogleForm method on edit button click', () => {
        spyOn(comp, 'toggleForm');
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        const editButton: DebugElement = fixture.debugElement.query(
            By.css('#form-edit-button')
        );
        editButton.nativeNode.click();
        expect(comp.toggleForm).toHaveBeenCalledTimes(1);
    });

    it('should toggle formState property on edit button click', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        const editButton: DebugElement = fixture.debugElement.query(
            By.css('#form-edit-button')
        );

        editButton.nativeNode.click();
        expect(comp.formState).toBe('expanded');
        editButton.nativeNode.click();
        expect(comp.formState).toBe('collapsed');
    });

    it('should call cancelForm() on cancel button click', () => {
        spyOn(comp, 'cancelForm');

        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        comp.formState = 'extended';
        fixture.detectChanges();

        const cancelButton: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-cancel')
        );
        cancelButton.nativeNode.click();

        expect(comp.cancelForm).toHaveBeenCalledTimes(1);
    });

    it('should collapse the form on cancel button click', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        comp.formState = 'extended';
        fixture.detectChanges();

        const cancelButton: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-cancel')
        );
        cancelButton.nativeNode.click();
        fixture.detectChanges();
        const form = de.query(By.css('.content-type__full-form'));

        expect(comp.formState).toBe('collapsed', 'form state collapsed');
        expect(form.nativeElement.style.height).toBe('0px', 'form height 0px');
        expect(form.nativeElement.style.overflow).toBe(
            'hidden',
            'form overflow hidden'
        );
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
            host: null,
            name: 'a new name',
            urlMapPattern: ''
        });

        const cancelButton: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-cancel')
        );
        cancelButton.nativeNode.click();
        fixture.detectChanges();

        expect(comp.form.value).toEqual({
            clazz: 'clazz',
            description: 'Hello Description',
            detailPage: '',
            host: null,
            name: 'Hello World',
            urlMapPattern: ''
        });
    });

    it('should remove focus from name on cancel button click', () => {
        spyOn(comp.name.nativeElement, 'blur');

        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        const cancelButton: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-cancel')
        );
        cancelButton.nativeNode.click();

        expect(comp.name.nativeElement.blur).toHaveBeenCalledTimes(1);
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

    // .focus() it's not being triggered
    xit('should toggle formState when the user focus on the name field', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        expect(comp.formState).toBe('collapsed', 'collapsed by default');

        const nameEl: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-name')
        );
        nameEl.nativeElement.focus();
        fixture.detectChanges();

        expect(comp.formState).toBe('expanded', 'expanded on focus');
    });

    it('should have basic form controls for non-content base types', () => {
        comp.data = {
            baseType: 'WIDGET'
        };
        fixture.detectChanges();

        expect(Object.keys(comp.form.controls).length).toBe(7);
        expect(comp.form.get('clazz')).not.toBeNull();
        expect(comp.form.get('name')).not.toBeNull();
        expect(comp.form.get('host')).not.toBeNull();
        expect(comp.form.get('description')).not.toBeNull();
        expect(comp.form.get('workflow')).not.toBeNull();
        expect(comp.form.get('publishDateVar')).not.toBeNull();
        expect(comp.form.get('expireDateVar')).not.toBeNull();
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

        expect(Object.keys(comp.form.controls).length).toBe(9);
        expect(comp.form.get('clazz')).not.toBeNull();
        expect(comp.form.get('name')).not.toBeNull();
        expect(comp.form.get('host')).not.toBeNull();
        expect(comp.form.get('description')).not.toBeNull();
        expect(comp.form.get('workflow')).not.toBeNull();
        expect(comp.form.get('publishDateVar')).not.toBeNull();
        expect(comp.form.get('expireDateVar')).not.toBeNull();
        expect(comp.form.get('detailPage')).not.toBeNull();
        expect(comp.form.get('urlMapPattern')).not.toBeNull();
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

    it('should show workflow disabled and with message if the license community it\'s true', () => {
        const dotcmsConfig = fixture.debugElement.injector.get(DotcmsConfig);
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

    it('should show workflow enable and no message if the license community it\'s false', () => {
        const dotcmsConfig = fixture.debugElement.injector.get(DotcmsConfig);
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
                clazz:
                    'com.dotcms.contenttype.model.field.ImmutableDateTimeField',
                id: '123',
                indexed: true,
                name: 'Date 1'
            },
            {
                clazz:
                    'com.dotcms.contenttype.model.field.ImmutableDateTimeField',
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
                clazz:
                    'com.dotcms.contenttype.model.field.ImmutableDateTimeField',
                id: '123',
                indexed: true,
                name: 'Date 1'
            },
            {
                clazz:
                    'com.dotcms.contenttype.model.field.ImmutableDateTimeField',
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
        const submitFormButton: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-submit')
        );
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

        const submitFormButton: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-submit')
        );
        submitFormButton.nativeElement.click();

        expect(comp.submitContent).toHaveBeenCalledTimes(1);
        expect(data).toEqual({
            clazz: '',
            description: '',
            detailPage: '',
            host: null,
            name: 'A content type name',
            urlMapPattern: ''
        });
    });
});
