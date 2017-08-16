import { Component, Input } from '@angular/core';
import { FieldProperty } from '../field-properties.interface';
import { MessageService } from '../../../../../../api/services/messages-service';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';

@Component({
    selector: 'required-property',
    template: `
        <div class="form__group" [formGroup]="group">
            <p-checkbox
                [label]="i18nMessages['required']"
                [value]="property.value"
                [formControlName]="property.name"
                binary="true">
            </p-checkbox>
        </div>
    `,
})
export class CheckboxPropertyComponent extends BaseComponent {
    property: FieldProperty;

    constructor(public messageService: MessageService) {
        super(
            [
                'required',
            ],
            messageService
        );
    }

    ngOnInit(): void {
    }
}