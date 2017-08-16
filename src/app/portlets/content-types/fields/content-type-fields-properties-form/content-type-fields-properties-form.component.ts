import { Component, Output, EventEmitter, Input, SimpleChanges, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Field } from '../index';
import { PROPERTY_INFO } from './field-properties';
import { AdDirective } from '../../../../view/directives/ad/ad.directive';

@Component({
    selector: 'content-type-fields-properties-form',
    templateUrl: './content-type-fields-properties-form.component.html'
})

export class ContentTypeFieldsPropertiesFormComponent {
    @Output() saveField: EventEmitter<any> = new EventEmitter();
    @Input() formFieldData: Field;

    form: FormGroup;
    submitted = false;
    requireFormFields = ['name'];
    fieldProperties: string[] = [];

    constructor(private fb: FormBuilder, private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.formFieldData.currentValue && this.formFieldData) {
            this.initFormGroup();
            // tslint:disable-next-line:forin
            for (let property in this.formFieldData) {
                if (PROPERTY_INFO[property]) {
                    this.fieldProperties.push(property);
                }
            }
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
        // this.submitted = true;
        // if (this.form.valid) {
        //     this.saveField.emit(this.form.value);
        // }
        console.log(this.form.value);
    }

    private initFormGroup(): void {
        // console.log('form field data: ', this.formFieldData);
        let formFields = {};

        if (this.formFieldData) {
            // tslint:disable-next-line:forin
            for (let property in this.formFieldData) {
                console.log('FormFieldData property: ', property);
                if (PROPERTY_INFO[property]) {
                    formFields[property] = [this.formFieldData[property]];
                }
            }
        }
        this.form = this.fb.group(formFields);
    }

    private isRequire(requireFields, property): any {
        requireFields.forEach(field => {
            if (field === property) {
                return Validators.required;
            }
        });
    }
}