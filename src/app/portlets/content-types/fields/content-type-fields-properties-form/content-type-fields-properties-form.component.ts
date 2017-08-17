import { Component, Output, EventEmitter, Input, SimpleChanges, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Field } from '../index';
import { AdDirective } from '../../../../view/directives/ad/ad.directive';
import { FieldPropertyService } from '../service';
import { MessageService } from '../../../../api/services/messages-service';
import { BaseComponent } from '../../../../view/components/_common/_base/base-component';

@Component({
    selector: 'content-type-fields-properties-form',
    templateUrl: './content-type-fields-properties-form.component.html'
})

export class ContentTypeFieldsPropertiesFormComponent extends BaseComponent {
    @Output() saveField: EventEmitter<any> = new EventEmitter();
    @Input() formFieldData: Field;

    @ViewChild('properties') propertiesContainer;

    form: FormGroup;
    submitted = false;
    fieldProperties: string[] = [];

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
                'Default-Value',
                'Hint',
                'Validation-RegEx',
                'Value'
            ],
            messageService
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.formFieldData.currentValue && this.formFieldData) {
            this.initFormGroup();

            console.log('formFieldData', this.formFieldData);
            // tslint:disable-next-line:forin
            for (let property in this.formFieldData) {
                if (this.fieldPropertyService.existsInfo(property)) {
                    this.fieldProperties.push(property);
                }
            }

            this.fieldProperties.sort((pa, pb) =>
                this.fieldPropertyService.getOrder(pa) - this.fieldPropertyService.getOrder(pb));

            console.log('this.fieldProperties', this.fieldProperties);
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

    public destroy(): void {
        this.fieldProperties = [];
        let propertiesContainer = this.propertiesContainer.nativeElement;
        propertiesContainer.childNodes.forEach(child => {
            if (child.tagName) {
                propertiesContainer.removeChild(child);
            }
        });
    }

    private initFormGroup(): void {
        // console.log('form field data: ', this.formFieldData);
        let formFields = {};

        if (this.formFieldData) {
            // tslint:disable-next-line:forin
            for (let property in this.formFieldData) {

                if (this.fieldPropertyService.existsInfo(property)) {
                    formFields[property] = [this.formFieldData[property]];
                }
            }
        }
        this.form = this.fb.group(formFields);
    }
}