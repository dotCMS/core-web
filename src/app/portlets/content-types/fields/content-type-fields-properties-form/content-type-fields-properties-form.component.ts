import { Component, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Field } from '../index';

@Component({
    selector: 'content-type-fields-properties-form',
    templateUrl: './content-type-fields-properties-form.component.html'
})

export class ContentTypeFieldsPropertiesFormComponent {
    @Output() fieldData: EventEmitter<any> = new EventEmitter();
    @Input() formFieldData: Field;

    form: FormGroup;
    submitted = false;

    constructor(private fb: FormBuilder) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.formFieldData.currentValue) {
            this.form.controls['name'].setValue(changes.formFieldData.currentValue.name);
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
    saveFieldProperties(value: any, isValid: boolean): void {
        this.submitted = true;
        if (isValid) {
            this.fieldData.emit(value);
        }
    }

    /**
     * Create the form fields
     * @private
     * @memberof ContentTypeFieldsPropertiesFormComponent
     */
    private initFormGroup(): void {
        this.form = this.fb.group({
            name: ['', Validators.required]
        });
    }
}