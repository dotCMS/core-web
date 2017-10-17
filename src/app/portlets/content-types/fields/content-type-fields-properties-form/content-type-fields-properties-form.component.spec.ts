import { DebugElement, ComponentFactoryResolver, SimpleChange, Directive, Input, Injectable } from '@angular/core';
import { ContentTypeFieldsPropertiesFormComponent } from './content-type-fields-properties-form.component';
import { ComponentFixture, async } from '@angular/core/testing';
import { MockMessageService } from '../../../../test/message-service.mock';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { FieldPropertyService } from '../service';
import { MessageService } from '../../../../api/services/messages-service';
import { Field } from '../index';
import { fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Directive({
    selector: '[dynamicFieldProperty]',
  })
class TestDynamicFieldPropertyDirective {
    @Input() propertyName: string;
    @Input() field: Field;
    @Input() group: FormGroup;
}

@Injectable()
class TestFieldPropertiesService {
    getProperties(fieldTypeClass: string): string[] {
        return ['property1', 'property2', 'property3'];
    }

    existsComponent(propertyName: string): boolean {
        return propertyName === 'property1' || propertyName === 'property2';
    }

    getDefaultValue(propertyName: string, fieldTypeClass?: string): any {
        return propertyName === 'property1' ? '' : true;
    }

    getValidations(propertyName: string): ValidationErrors[] {
        return propertyName === 'property1' ? [Validators.required] : [];
    }

    isDisabledInEditMode(propertyName: string): boolean {
        return propertyName === 'property1';
    }

    getOrder(propertyName: string): any {
        return propertyName === 'property1' ? 0 : 1;
    }
}

describe('ContentTypeFieldsPropertiesFormComponent', () => {
    let comp: ContentTypeFieldsPropertiesFormComponent;
    let fixture: ComponentFixture<ContentTypeFieldsPropertiesFormComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let fb: FormBuilder;
    let form: FormGroup;


    const messageServiceMock = new MockMessageService({
        'name': 'name',
        'Label': 'Label',
        'message.field.fieldType': 'message.field.fieldType',
        'categories': 'categories',
        'Data-Type': 'Data-Type',
        'required': 'required',
        'User-Searchable': 'User-Searchable',
        'System-Indexed': 'System-Indexed',
        'listed': 'listed',
        'Unique': 'Unique',
        'Default-Value': 'Default-Value',
        'Hint': 'Hint',
        'Validation-RegEx': 'Validation-RegEx',
        'Value': 'Value',
        'Binary': 'Binary',
        'Text': 'Text',
        'True-False': 'True-False',
        'Date': 'Date',
        'Decimal': 'Decimal',
        'Whole-Number': 'Whole-Number',
        'Large-Block-of-Text': 'Large-Block-of-Text',
        'System-Field': 'System-Field',
    });

    beforeEach(async(() => {
        DOTTestBed.configureTestingModule({
            declarations: [
                ContentTypeFieldsPropertiesFormComponent,
                TestDynamicFieldPropertyDirective
            ],
            imports: [
            ],
            providers: [
                FormBuilder,
                ComponentFactoryResolver,
                FieldPropertyService,
                { provide: FieldPropertyService, useClass: TestFieldPropertiesService },
                { provide: MessageService, useValue: messageServiceMock },
            ]
        });

        fixture = DOTTestBed.createComponent(ContentTypeFieldsPropertiesFormComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;

        fb = new FormBuilder();
        form = fb.group({});
    }));

    describe('should init component', () => {
        beforeEach(async(() => {
            this.field = {
                clazz: 'field.class',
                name: 'fieldName',
            };

            comp.formFieldData = this.field;
            comp.form = form;
        }));

        it('should init form right', () => {
            const mockFieldPropertyService = fixture.debugElement.injector.get(FieldPropertyService);
            const spyMethod = spyOn(mockFieldPropertyService, 'getProperties').and.returnValue(['property1', 'property2', 'property3']);

            comp.ngOnChanges({
                formFieldData: new SimpleChange(null, this.field, true),
            });

            expect(spyMethod).toHaveBeenCalledWith(this.field.clazz);
            expect(this.field.clazz).toBe(form.get('clazz').value);

            expect('').toBe(form.get('property1').value);
            expect(true).toBe(form.get('property2').value);
            expect(form.get('property3')).toBeNull();
        });

        it('should init field proeprties', () => {
            comp.ngOnChanges({
                formFieldData: new SimpleChange(null, this.field, true),
            });

            expect('property1').toBe(comp.fieldProperties[0]);
            expect('property2').toBe(comp.fieldProperties[1]);
        });

        it('should init validators right', () => {
            const mockFieldPropertyService = fixture.debugElement.injector.get(FieldPropertyService);
            spyOn(mockFieldPropertyService, 'getProperties').and.returnValue(['property1', 'property2']);
            const spyGetValidationsMethod = spyOn(mockFieldPropertyService, 'getValidations').
                and.callFake(propertyName => 'property1' === propertyName ? [Validators.required] : null);

            comp.ngOnChanges({
                formFieldData: new SimpleChange(null, this.field, true),
            });

            expect(spyGetValidationsMethod).toHaveBeenCalledWith('property1');
            expect(1).toBe(form.controls['property1'].validator.length);
            expect(form.controls['property2'].validator).toBeNull();
        });

        it('should has a formGroup', () => {
            const formGroup = de.queryAll(By.css('[formGroup="form"]'));
            expect(formGroup).not.toBeNull();
        });

        describe('disabled property', () => {
            beforeEach(async(() => {
                const mockFieldPropertyService = fixture.debugElement.injector.get(FieldPropertyService);
                spyOn(mockFieldPropertyService, 'getProperties').and.returnValue(['property1', 'property2']);
                spyOn(mockFieldPropertyService, 'getValidations').and.returnValue([Validators.required]);
                spyOn(mockFieldPropertyService, 'isDisabledInEditMode').and.callFake(propertyName => 'property1' === propertyName);
            }));

            it('should disabled property1', () => {
                this.field.id = '1';

                comp.ngOnChanges({
                    formFieldData: new SimpleChange(null, this.field, true),
                });

                expect(true).toBe(form.controls['property1'].disabled);
                expect(false).toBe(form.controls['property2'].disabled);
            });

            it('should not diabled anything', () => {
                this.field.id = '1';

                comp.ngOnChanges({
                    formFieldData: new SimpleChange(null, this.field, true),
                });

                expect(true).toBe(form.controls['property1'].disabled);
                expect(false).toBe(form.controls['property2'].disabled);
            });
        });
    });
});
