import {
  Component,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  OnChanges,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from '../../../../api/services/messages-service';
import { BaseComponent } from '../../../../view/components/_common/_base/base-component';
import { Field } from '../shared';
import { FieldPropertyService } from '../service/';


@Component({
    selector: 'content-type-fields-properties-form',
    styleUrls: ['./content-type-fields-properties-form.component.scss'],
    templateUrl: './content-type-fields-properties-form.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ContentTypeFieldsPropertiesFormComponent extends BaseComponent implements OnChanges, OnInit {
    @Output() saveField: EventEmitter<any> = new EventEmitter();
    @Input() formFieldData: Field;

    @ViewChild('properties') propertiesContainer;

    form: FormGroup;
    fieldProperties: string[] = [];
    checkboxFields: string[] = ['indexed', 'listed', 'required', 'searchable', 'unique'];

    constructor(private fb: FormBuilder, private componentFactoryResolver: ComponentFactoryResolver,
        public messageService: MessageService, private fieldPropertyService: FieldPropertyService) {

        super(
            [
                'contenttypes.field.properties.name.label',
                'contenttypes.field.properties.category.label',
                'contenttypes.field.properties.required.label',
                'contenttypes.field.properties.User_Searchable.label',
                'contenttypes.field.properties.System_Indexed.label',
                'contenttypes.field.properties.listed.label',
                'contenttypes.field.properties.unique.label',
                'contenttypes.field.properties.default_value.label',
                'contenttypes.field.properties.hint.label',
                'contenttypes.field.properties.Validation_RegEx.label',
                'contenttypes.field.properties.data_type.label',
                'contenttypes.field.properties.value.label',
                'contenttypes.field.properties.data_type.values.binary',
                'contenttypes.field.properties.data_type.values.text',
                'contenttypes.field.properties.data_type.values.boolean',
                'contenttypes.field.properties.data_type.values.date',
                'contenttypes.field.properties.data_type.values.decimal',
                'contenttypes.field.properties.data_type.values.number',
                'contenttypes.field.properties.data_type.values.large_text',
                'contenttypes.field.properties.data_type.values.system',
                'contenttypes.field.properties.category.error.required',
                'contenttypes.field.properties.default_value..error.format',
                'contenttypes.field.properties.name.error.required',
                'contenttypes.field.properties.Validation_RegEx.values.select',
                'contenttypes.field.properties.Validation_RegEx.values.no_html',
                'contenttypes.field.properties.Validation_RegEx.values.us_phone',
                'contenttypes.field.properties.Validation_RegEx.values.us_zip_code',
                'contenttypes.field.properties.Validation_RegEx.values.letters_only',
                'contenttypes.field.properties.Validation_RegEx.values.numbers_only',
                'contenttypes.field.properties.Validation_RegEx.values.email',
                'contenttypes.field.properties.Validation_RegEx.values.alphanumeric',
                'contenttypes.field.properties.Validation_RegEx.values.url_pattern',
            ],
            messageService
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.formFieldData.currentValue && this.formFieldData) {
            const properties = this.fieldPropertyService.getProperties(this.formFieldData.clazz);
            this.initFormGroup(properties);

            this.fieldProperties = properties.filter(property => this.fieldPropertyService.existsComponent(property))
                .sort((property1, proeprty2) =>
                    this.fieldPropertyService.getOrder(property1) - this.fieldPropertyService.getOrder(proeprty2));
        }
    }

    ngOnInit(): void {
        this.initFormGroup();
    }

    /**
     * Emit the form data to be saved
     * @param {*} value
     * @param {boolean} isValid
     * @memberof ContentTypeFieldsPropertiesFormComponent
     */
    saveFieldProperties(): void {
        if (this.form.valid) {
             this.saveField.emit(this.form.value);
        } else {
            this.fieldProperties.forEach(property => this.form.get(property).markAsTouched());
        }
    }

    public destroy(): void {
        this.fieldProperties = [];
        const propertiesContainer = this.propertiesContainer.nativeElement;
        propertiesContainer.childNodes.forEach(child => {
            if (child.tagName) {
                propertiesContainer.removeChild(child);
            }
        });
    }

    private initFormGroup(properties?: string[]): void {
        const formFields = {};

        if (properties) {
            properties.filter(property => this.fieldPropertyService.existsComponent(property))
                .forEach(property => {
                    formFields[property] = [{
                        value: this.formFieldData[property] ||
                                this.fieldPropertyService.getDefaultValue(property, this.formFieldData.clazz),
                        disabled: this.formFieldData.id && this.fieldPropertyService.isDisabledInEditMode(property)
                    }, this.fieldPropertyService.getValidations(property)];
                });

            formFields['clazz'] = this.formFieldData.clazz;
        }
        this.form = this.fb.group(formFields);
    }
}
