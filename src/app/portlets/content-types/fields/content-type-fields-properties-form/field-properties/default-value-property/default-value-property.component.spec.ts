import { DefaultValuePropertyComponent } from './index';
import { ComponentFixture, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { MockDotMessageService } from '../../../../../../test/dot-message-service.mock';
import { DOTTestBed } from '../../../../../../test/dot-test-bed';
import { DotMessageService } from '../../../../../../api/services/dot-messages-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FieldValidationMessageComponent } from '../../../../../../view/components/_common/field-validation-message/field-validation-message';

describe('DefaultValuePropertyComponent', () => {
    let comp: DefaultValuePropertyComponent;
    let fixture: ComponentFixture<DefaultValuePropertyComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const messageServiceMock = new MockDotMessageService({
        'Default-Value': 'Default-Value',
        'contenttypes.field.properties.default_value.error.format': 'default error',
        'contenttypes.field.properties.default_value.immutable_date.error.format': 'date error',
        'contenttypes.field.properties.default_value.immutable_date_time.error.format': 'date-time error'
    });

    beforeEach(
        async(() => {
            DOTTestBed.configureTestingModule({
                declarations: [DefaultValuePropertyComponent, FieldValidationMessageComponent],
                imports: [],
                providers: [{ provide: DotMessageService, useValue: messageServiceMock }]
            });

            fixture = DOTTestBed.createComponent(DefaultValuePropertyComponent);
            comp = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;
            comp.group = new FormGroup({
                name: new FormControl('')
            });
            comp.property = {
                name: 'name',
                value: 'value',
                field: {}
            };
        })
    );

    it('should have a form', () => {
        const group = new FormGroup({});
        comp.group = group;
        const divForm: DebugElement = fixture.debugElement.query(By.css('div'));

        expect(divForm).not.toBeNull();
        expect(group).toEqual(divForm.componentInstance.group);
    });

    it('should have a input', () => {
        fixture.detectChanges();
        const pInput: DebugElement = fixture.debugElement.query(By.css('input[type="text"]'));

        expect(pInput).not.toBeNull();
    });

    it('should have a field-message', () => {
        fixture.detectChanges();
        const fieldValidationmessage: DebugElement = fixture.debugElement.query(By.css('dot-field-validation-message'));

        expect(fieldValidationmessage).not.toBeNull();
        expect(comp.group.controls['name']).toBe(fieldValidationmessage.componentInstance.field);
    });

    it('set error label to the default value', () => {
        fixture.detectChanges();

        expect(comp.errorLabel).toEqual('default error');
    });
    it('set error label to specific valid date field', () => {
        comp.property.field.clazz = 'com.dotcms.contenttype.model.field.ImmutableDateField';
        fixture.detectChanges();

        expect(comp.errorLabel).toEqual('date error');
    });

    it('set error label to specific valid date time field', () => {
        comp.property.field.clazz = 'com.dotcms.contenttype.model.field.ImmutableDateTimeField';
        fixture.detectChanges();

        expect(comp.errorLabel).toEqual('date-time error');
    });

    it('should show the error', () => {
        comp.group = new FormGroup({
            name: new FormControl('', Validators.required)
        });
        comp.property = {
            name: 'name',
            value: null,
            field: {}
        };
        comp.group.get('name').markAsTouched();
        fixture.detectChanges();

        expect(de.query(By.css('dot-field-validation-message')).nativeElement.innerText).toContain('default error');
    });
});
