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
                'name',
                'Label',
                'message.field.fieldType',
                'categories',
                'Data-Type',
                'required',
                'User-Searchable',
                'System-Indexed',
                'listed',
                'Unique',
                'Default-Value',
                'Hint',
                'Validation-RegEx',
                'Value',
                'Binary',
                'Text',
                'True-False',
                'Date',
                'Decimal',
                'Whole-Number',
                'Large-Block-of-Text',
                'System-Field',
            ],
            messageService
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.formFieldData.currentValue && this.formFieldData) {
            const properties = this.fieldPropertyService.getProperties(this.formFieldData.clazz);
            this.initFormGroup(properties);

            this.fieldProperties = properties.filter(property => this.fieldPropertyService.existsInfo(property))
                .sort((pa, pb) => this.fieldPropertyService.getOrder(pa) - this.fieldPropertyService.getOrder(pb));
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
            properties.filter(property => this.fieldPropertyService.existsInfo(property))
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
