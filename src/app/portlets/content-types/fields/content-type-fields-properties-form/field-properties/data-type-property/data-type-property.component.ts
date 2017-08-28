import { Component, Input, OnInit } from '@angular/core';
import { Field } from '../../../index';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../../../../api/services/messages-service';
import { FieldProperty } from '../field-properties.interface';
import { DATA_TYPE_PROPERTY_INFO } from '../../../service/data-type-property-info';

@Component({
    selector: 'dataType-property',
    templateUrl: './data-type-property.component.html',
})
export class DataTypePropertyComponent extends BaseComponent implements OnInit {
    property: FieldProperty;
    group: FormGroup;
    radioInputs: object;

    constructor(public messageService: MessageService) {
        super(
            [
                'Data-Type',
                'Binary',
                'Text',
                'True-False',
                'Date',
                'Decimal',
                'Whole-Number',
                'Large-Block-of-Text',
                'System-Field',
            ],
            messageService
        );
    }

    ngOnInit(): void {
        this.radioInputs = DATA_TYPE_PROPERTY_INFO[this.property.field.clazz];
    }

    isEmpty(obj) {
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }
}
