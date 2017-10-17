import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../../api/services/messages-service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ContentTypeFieldsVariablesComponent } from '../content-type-fields-variables/content-type-fields-variables.component';
import { Field } from '../shared/field.model';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-content-type-fields-form-layout',
    styleUrls: ['./content-type-fields-form-layout.component.scss'],
    templateUrl: './content-type-fields-form-layout.component.html',
})
export class ContentTypeFieldsFormLayoutComponent extends BaseComponent implements OnInit {

    @Input() field: Field;

    form: FormGroup;
    fieldPropertiesValid = true;

    @ViewChild('fieldVariables') fieldVariablesComponent: ContentTypeFieldsVariablesComponent;

    constructor(messageService: MessageService, private fb: FormBuilder) {
        super([
            'contenttypes.field.properties.label',
            'contenttypes.field.variables.label'
        ], messageService);
    }

    ngOnInit(): void {
        this.form = this.fb.group({});

        this.form.valueChanges.subscribe(() => {
            this.checkFieldsPropertiesValidation();
        });
    }

    get value(): any {
        this.fieldVariablesComponent.removeEmptyRow();
        return this.form.valid ? this.form.value : null;
    }

    checkFieldsPropertiesValidation(): void {
        let result = true;

        for (const controlName in this.form.controls) {
            if (controlName !== 'fieldVariables' && !this.form.controls[controlName].valid) {
                result = false;
                break;
            }
        }

        this.fieldPropertiesValid = result;
    }
}

