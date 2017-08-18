import { Component, Output, EventEmitter, Input, SimpleChanges, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, OnChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FieldPropertyService } from '../service';
import { MessageService } from '../../../../api/services/messages-service';
import { BaseComponent } from '../../../../view/components/_common/_base/base-component';
import { Field } from '../shared';


@Component({
    selector: 'content-type-fields-properties-form',
    templateUrl: './content-type-fields-properties-form.component.html'
})

export class ContentTypeFieldsPropertiesFormComponent extends BaseComponent implements OnChanges, OnInit {
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
            this.initFormGroup();

            // tslint:disable-next-line:forin
            for (const property in this.formFieldData) {
                if (this.fieldPropertyService.existsInfo(property)) {
                    this.fieldProperties.push(property);
                }
            }

            this.fieldProperties.sort((pa, pb) =>
                this.fieldPropertyService.getOrder(pa) - this.fieldPropertyService.getOrder(pb));
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
        const propertiesContainer = this.propertiesContainer.nativeElement;
        propertiesContainer.childNodes.forEach(child => {
            if (child.tagName) {
                propertiesContainer.removeChild(child);
            }
        });
    }

    private initFormGroup(): void {
        // console.log('form field data: ', this.formFieldData);
        const formFields = {};

        if (this.formFieldData) {
            for (const property in this.formFieldData) {
                if (this.fieldPropertyService.existsInfo(property)) {
                    const validations = this.fieldPropertyService.isRequired(property) ? [Validators.required] : [];
                    formFields[property] = [this.formFieldData[property], validations];
                }
            }
        }

        this.form = this.fb.group(formFields);
    }
}
