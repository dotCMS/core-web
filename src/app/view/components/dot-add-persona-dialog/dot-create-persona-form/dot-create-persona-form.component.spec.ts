import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DotCreatePersonaFormComponent } from './dot-create-persona-form.component';
import { DebugElement } from '@angular/core';
import { MockDotMessageService } from '@tests/dot-message-service.mock';
import { DOTTestBed } from '@tests/dot-test-bed';
import { DotMessageService } from '@services/dot-messages-service';
import { mockSites, SiteServiceMock } from '@tests/site-service.mock';
import { SiteService } from 'dotcms-js';
import { By } from '@angular/platform-browser';
import { FileUploadModule } from 'primeng/primeng';
import { DotSiteSelectorModule } from '@components/_common/dot-site-selector/dot-site-selector.module';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { DotAutofocusModule } from '@directives/dot-autofocus/dot-autofocus.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder } from '@angular/forms';

const FROM_INITIAL_VALUE = {
    hostFolder: mockSites[0].identifier,
    keyTag: '',
    name: '',
    photo: ''
};

const mockFileUploadResponse = {
    files: [{ name: 'fileName.png' }],
    xhr: { response: '{ "tempFiles": [{"id":"temp-file_123"}]}' }
};

describe('DotCreatePersonaFormComponent', () => {
    let component: DotCreatePersonaFormComponent;
    let fixture: ComponentFixture<DotCreatePersonaFormComponent>;
    const messageServiceMock = new MockDotMessageService({
        'modes.persona.upload.file': 'Upload File',
        'modes.persona.name': 'Name',
        'modes.persona.key.tag': 'Key Tag',
        'dot.common.choose': 'Choose',
        'dot.common.remove': 'Remove',
        'modes.persona.host': 'Host',
        'modes.persona.name.error.required': 'Name is required'
    });

    beforeEach(() => {
        const siteServiceMock = new SiteServiceMock();

        DOTTestBed.configureTestingModule({
            declarations: [DotCreatePersonaFormComponent],
            imports: [
                BrowserAnimationsModule,
                FileUploadModule,
                DotSiteSelectorModule,
                DotFieldValidationMessageModule,
                DotAutofocusModule
            ],
            providers: [
                { provide: DotMessageService, useValue: messageServiceMock },
                { provide: SiteService, useValue: siteServiceMock },
                FormBuilder
            ]
        });

        fixture = TestBed.createComponent(DotCreatePersonaFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should load labels correctly', () => {
        const hostLabel: DebugElement = fixture.debugElement.query(By.css('.form__label'));
        const nameLabel: DebugElement = fixture.debugElement.query(
            By.css('label[for="persona-name"]')
        );
        const keyTagLabel: DebugElement = fixture.debugElement.query(
            By.css('label[for="persona-keyTag"]')
        );
        const imageLabel: DebugElement = fixture.debugElement.query(
            By.css('label[for="persona-image"]')
        );
        const validationMessage: DebugElement = fixture.debugElement.query(
            By.css('dot-field-validation-message')
        );
        const fileUpload: DebugElement = fixture.debugElement.query(By.css('p-fileUpload'));
        expect(hostLabel.nativeElement.innerText).toEqual('Host:');
        expect(nameLabel.nativeElement.innerText).toEqual('Name:');
        expect(keyTagLabel.nativeElement.innerText).toEqual('Key Tag:');
        expect(imageLabel.nativeElement.innerText).toEqual('Upload File:');
        expect(validationMessage.componentInstance.message).toEqual('Name is required');
        expect(fileUpload.componentInstance.chooseLabel).toEqual('Choose');
    });

    it('should be invalid by default', () => {
        expect(component.form.valid).toBe(false);
    });

    it('should set initial value of the form on load', () => {
        expect(component.form.getRawValue()).toEqual(FROM_INITIAL_VALUE);
    });

    it('should update the form hostFolder on site selector change', () => {
        const siteSelector: DebugElement = fixture.debugElement.query(By.css('dot-site-selector'));
        siteSelector.triggerEventHandler('change', mockSites[1]);
        fixture.detectChanges();
        expect(component.form.get('hostFolder').value).toEqual(mockSites[1].identifier);
    });

    it('should update form name when enter name', () => {
        const nameInput: DebugElement = fixture.debugElement.query(By.css('#persona-name'));
        component.form.get('name').setValue('John');
        fixture.detectChanges();
        expect(nameInput.nativeElement.value).toEqual('John');
    });

    it('should set Key Tag camel case based on the name value', () => {
        const nameInput: DebugElement = fixture.debugElement.query(By.css('#persona-name'));
        const keyTagInput: DebugElement = fixture.debugElement.query(By.css('#persona-keyTag'));
        component.form.get('name').setValue('John Doe');
        nameInput.triggerEventHandler('change', {});
        fixture.detectChanges();
        expect(keyTagInput.nativeElement.value).toEqual('johnDoe');
    });

    it('should set the p-fileUpload with the correctly attributes', () => {
        const fileUpload: DebugElement = fixture.debugElement.query(By.css('p-fileUpload'));

        expect(fileUpload.componentInstance.url).toEqual('/api/v1/temp');
        expect(fileUpload.componentInstance.accept).toEqual('image/*');
        expect(fileUpload.componentInstance.auto).toEqual('true');
        expect(fileUpload.componentInstance.mode).toEqual('basic');
    });

    it('should set the photo id and imageName after image upload', () => {
        const fileUpload: DebugElement = fixture.debugElement.query(By.css('p-fileUpload'));
        fileUpload.triggerEventHandler('onUpload', mockFileUploadResponse);
        fixture.detectChanges();
        expect(component.form.get('photo').value).toEqual('temp-file_123');
        expect(component.imageName).toEqual(mockFileUploadResponse.files[0].name);
    });

    it('should clear photo form value and imageName when remove image', () => {
        component.form.get('photo').setValue('test');
        component.imageName = 'test';
        fixture.detectChanges();

        const removeButton: DebugElement = fixture.debugElement.query(By.css('button'));
        removeButton.triggerEventHandler('click', {});
        expect(removeButton.nativeElement.innerText).toBe('REMOVE');
        expect(component.form.get('photo').value).toEqual('');
        expect(component.imageName).toEqual(null);
    });

    it('should emit if form is valid after changes', () => {
        spyOn(component.isValid, 'emit');
        component.form.setValue({
            photo: 'test',
            name: 'test',
            keyTag: 'test',
            hostFolder: 'test'
        });
        expect(component.isValid.emit).toHaveBeenCalledWith(true);
    });

    it('should emit if form is invalid after changes', () => {
        spyOn(component.isValid, 'emit');
        component.form.get('name').setValue('John');
        expect(component.isValid.emit).toHaveBeenCalledWith(false);
    });

    it('should reset from to initial value', () => {
        component.form.get('name').setValue('John');
        component.form.get('hostFolder').setValue('test');
        component.resetForm();
        expect(component.form.getRawValue()).toEqual(FROM_INITIAL_VALUE);
    });
});
