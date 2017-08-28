import { Component, Input, SimpleChanges } from '@angular/core';
import { FieldProperty } from '../field-properties.interface';
import { MessageService } from '../../../../../../api/services/messages-service';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'checkbox-property',
    templateUrl: './checkbox-property.component.html',
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

    setCheckboxLabel(field): string {
        return this.map[field] || field;
    }
}
