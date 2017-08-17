import { Component, Input } from '@angular/core';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../../../../api/services/messages-service';
import { FieldProperty } from '../field-properties.interface';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'values-property',
    templateUrl: './values-property.component.html',
})
export class ValuesPropertyComponent extends BaseComponent {
    property: FieldProperty;
    group: FormGroup;

    constructor(public messageService: MessageService) {
        super(
            [
                'Value',
            ],
            messageService
        );
    }

    ngOnInit(): void {
    }
}