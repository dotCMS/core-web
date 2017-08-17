import { Component, Input } from '@angular/core';
import { FieldProperty } from '../field-properties.interface';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../../../../api/services/messages-service';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'default-value-property',
    templateUrl: './default-value-property.component.html',
})
export class DefaultValuePropertyComponent extends BaseComponent {
    property: FieldProperty;
    group: FormGroup;

    constructor(public messageService: MessageService) {
        super(
            [
                'Default-Value',
            ],
            messageService
        );
    }

    ngOnInit(): void {
    }
}