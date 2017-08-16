import { Component, Input } from '@angular/core';
import { Field } from '../../../index';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../../../../api/services/messages-service';
import { FieldProperty } from '../field-properties.interface';

@Component({
    selector: 'required-property',
    templateUrl: './data-type.component.html',
})
export class DataTypePropertyComponent extends BaseComponent  {
    property: FieldProperty;
    group: FormGroup;

    constructor(public messageService: MessageService) {
        super(
            [
                'Data-Type',
                'Binary',
            ],
            messageService
        );
    }

    ngOnInit(): void {
    }
}