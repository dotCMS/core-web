import { Component, Input, SimpleChanges, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FieldProperty } from '../field-properties.model';
import { MessageService } from '../../../../../../api/services/messages-service';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
    selector: 'checkbox-property',
    templateUrl: './checkbox-property.component.html',
})
export class CheckboxPropertyComponent extends BaseComponent implements OnInit {
    property: FieldProperty;
    group: FormGroup;
    checked = false;
    indexedCheckbox: AbstractControl;
    requiredCheckbox: AbstractControl;

    private readonly map = {
        indexed: 'contenttypes.field.properties.system_indexed.label',
        listed: 'contenttypes.field.properties.listed.label',
        required: 'contenttypes.field.properties.required.label',
        searchable: 'contenttypes.field.properties.user_searchable.label',
        unique: 'contenttypes.field.properties.unique.label',
    };

    constructor(public messageService: MessageService) {
        super(
            [
                'contenttypes.field.properties.required.label',
                'contenttypes.field.properties.user_searchable.label',
                'contenttypes.field.properties.system_indexed.label',
                'contenttypes.field.properties.listed.label',
                'contenttypes.field.properties.unique.label'
            ],
            messageService
        );
    }

    ngOnInit(): void {
        this.indexedCheckbox = this.group.controls.indexed;
        this.requiredCheckbox = this.group.controls.required;
    }

    setCheckboxLabel(field): string {
        return this.map[field] || field;
    }

    handleCheckedPropery(): void {
        if (this.checked) {
            if (this.property.name === 'searchable' || this.property.name === 'listed') {
                this.setIndexedPropertyChecked();
            }
            if (this.property.name === 'unique') {
                this.setIndexedPropertyChecked();
                this.setRequiredPropertyChecked();
            }
        } else {
            this.indexedCheckbox.enable();
            this.requiredCheckbox.enable();
        }
    }

    setIndexedPropertyChecked(): void {
        this.indexedCheckbox.setValue('checked');
        this.indexedCheckbox.disable();
    }

    setRequiredPropertyChecked(): void {
        this.requiredCheckbox.setValue('checked');
        this.requiredCheckbox.disable();
    }
}
