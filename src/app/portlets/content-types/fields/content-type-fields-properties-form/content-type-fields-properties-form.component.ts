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
    @Output() fieldProperties: EventEmitter<any> = new EventEmitter();
    @Input() formFieldData: Field;
    @Input() properties;
    @ViewChild(AdDirective) adHost: AdDirective;

    form: FormGroup;
    submitted = false;
    requireFormFields = ['name'];

    constructor(private fb: FormBuilder, private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnChanges(changes: SimpleChanges): void {
        console.log('ng onChange', this.formFieldData);

        if (changes.formFieldData.currentValue && this.formFieldData) {
            this.initFormGroup();
            this.loadComponents();
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
        //     this.fieldProperties.emit(this.form.value);
        // }
        console.log(this.form.value);
    }

    private loadComponents(): void {
        // tslint:disable-next-line:forin
        for (let property in this.formFieldData) {
            let component = PROPERTY_INFO[property];

            if (component) {
                this.createComponent(component, property);
            }
        }
    }

    private createComponent(component, property): void {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        let viewContainerRef = this.adHost.viewContainerRef;
        let componentRef: ComponentRef<any> = viewContainerRef.createComponent(componentFactory);

        componentRef.instance.propertyName = this.form.get(property);
        componentRef.instance.propertyValue = this.formFieldData[property];
        componentRef.instance.field = this.formFieldData;
    }

    private initFormGroup(): void {
        let formFields = {};

        if (this.formFieldData) {
            // tslint:disable-next-line:forin
            for (let property in this.formFieldData) {
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