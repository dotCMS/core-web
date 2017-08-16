import { Component, Input } from '@angular/core';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../../../../api/services/messages-service';
import { FieldProperty } from '../field-properties.interface';

@Component({
    selector: 'hint-property',
    templateUrl: './regex-check-property.component.html',
})
export class RegexCheckPropertyComponent extends BaseComponent {
    property: FieldProperty;

    constructor(public messageService: MessageService) {
        super(
            [
                'Validation-RegEx',
            ],
            messageService
        );
    }

    ngOnInit(): void {
    }
}