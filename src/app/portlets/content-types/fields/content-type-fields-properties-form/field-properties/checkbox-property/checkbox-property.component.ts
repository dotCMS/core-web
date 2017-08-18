import { Component, Input, SimpleChanges } from '@angular/core';
import { FieldProperty } from '../field-properties.interface';
import { MessageService } from '../../../../../../api/services/messages-service';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'required-property',
    template: `
        <div class="form__group" [formGroup]="group">
            <p-checkbox
                [label]="i18nMessages[setCheckboxLabel(property.name)]"
                [value]="property.value"
                [formControlName]="property.name"
                binary="true">
            </p-checkbox>
        </div>
    `,
})
export class CheckboxPropertyComponent extends BaseComponent {
    property: FieldProperty;
    group: FormGroup;

    private readonly map = {
        indexed: 'System-Indexed',
        listed: 'listed',
        required: 'required',
        searchable: 'User-Searchable',
        unique: 'Unique',
    };

    constructor(public messageService: MessageService) {
        super(
            [
                'required',
                'User-Searchable',
                'System-Indexed',
                'listed',
                'Unique',
            ],
            messageService
        );
    }

    ngOnInit(): void {
    }

    setCheckboxLabel(field): string {
        return this.map[field] || field;
    }
}