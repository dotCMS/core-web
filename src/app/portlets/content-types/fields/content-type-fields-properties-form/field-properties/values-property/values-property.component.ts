import { Component, Input } from '@angular/core';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../../../../api/services/messages-service';
import { FieldProperty } from '../field-properties.interface';

@Component({
    selector: 'values-property',
    templateUrl: './values-property.component.html',
})
export class ValuesPropertyComponent extends BaseComponent {
    property: FieldProperty;

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