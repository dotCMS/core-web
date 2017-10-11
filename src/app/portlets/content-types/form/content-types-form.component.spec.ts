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

describe('ContentTypesFormComponent', () => {
    let comp: ContentTypesFormComponent;
    let fixture: ComponentFixture<ContentTypesFormComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(
        async(() => {
            const messageServiceMock = new MockMessageService({
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

    it('should be collapsed by default in edit mode', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        const form = de.query(By.css('.content-type__full-form'));

        expect(comp.formState).toBe('collapsed', 'form state collapsed');
        expect(form.nativeElement.style.height).toBe('0px', 'form height 0');
        expect(form.nativeElement.style.overflow).toBe('hidden', 'form overflow hidden');
    });

    it('should be expanded by default in create mode', () => {
        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();

        const form = de.query(By.css('.content-type__full-form'));

        expect(comp.formState).toBe('expanded', 'form state extpanded');
        expect(form.nativeElement.style.height).toBe('', 'form height not set to be auto');
        expect(form.nativeElement.style.overflow).toBe('visible', 'form overflow visible');
    });

    it('should have a button to edit button', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();
        const editButton: DebugElement = fixture.debugElement.query(By.css('#form-edit-button'));
        expect(editButton).toBeTruthy();
    });

    it('should call toogleForm method on action button click', () => {
        spyOn(comp, 'toggleForm');
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        const editButton: DebugElement = fixture.debugElement.query(By.css('#form-edit-button'));
        editButton.nativeNode.click();
        expect(comp.toggleForm).toHaveBeenCalledTimes(1);
    });

    it('should toggle formState property on action button click', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        const editButton: DebugElement = fixture.debugElement.query(By.css('#form-edit-button'));

        editButton.nativeNode.click();
        expect(comp.formState).toBe('expanded');
        editButton.nativeNode.click();
        expect(comp.formState).toBe('collapsed');
    });

    // .focus() it's not being triggered
    xit(
        'should toggle formState when the user focus on the name field',
        async(() => {
            comp.data = {
                baseType: 'CONTENT',
                id: '123'
            };
            fixture.detectChanges();

            expect(comp.formState).toBe('collapsed', 'collapsed by default');

            const nameEl: DebugElement = fixture.debugElement.query(
                By.css('#content-type-form-name')
            );
            nameEl.nativeNode.focus();
            fixture.detectChanges();

            expect(comp.formState).toBe('expanded', 'expanded on focus');
        })
    );

    it('should be invalid by default', () => {
        comp.data = {
            baseType: 'CONTENT'
        };
        fixture.detectChanges();
        expect(comp.form.valid).toBeFalsy();
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

    it('should render disabled dates fields', () => {
        comp.data = {
            baseType: 'CONTENT',
            id: '123'
        };
        fixture.detectChanges();

        expect(comp.form.get('publishDateVar').disabled).toBe(true);
        expect(comp.form.get('expireDateVar').disabled).toBe(true);
    });

    it('should render enabled dates fields', () => {
        comp.data = {
            baseType: 'CONTENT',
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

    it('should not send data with invalid form', () => {
        comp.data = {
            baseType: 'CONTENT',
        };
        fixture.detectChanges();

        let data = null;
        spyOn(comp, 'submitContent').and.callThrough();

        comp.onSubmit.subscribe(res => (data = res));
        const submitFormButton: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-submit')
        );
        submitFormButton.nativeElement.click();

        expect(comp.submitContent).toHaveBeenCalledTimes(1);
        expect(data).toBeNull();
    });

    it('should send data with valid form', () => {
        comp.data = {
            baseType: 'CONTENT',
        };
        fixture.detectChanges();

        let data = null;
        spyOn(comp, 'submitContent').and.callThrough();

        comp.onSubmit.subscribe(res => (data = res));

        comp.form.controls.name.setValue('A content type name');

        const submitFormButton: DebugElement = fixture.debugElement.query(
            By.css('#content-type-form-submit')
        );
        submitFormButton.nativeElement.click();

        expect(comp.submitContent).toHaveBeenCalledTimes(1);
        expect(data).toEqual({
            clazz: '',
            description: '',
            detailPage: '',
            host: '',
            name: 'A content type name',
            urlMapPattern: '',
            workflow: ''
        });
    });
});
