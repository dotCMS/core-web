import { Component, Input, OnInit } from '@angular/core';
import { Field } from '../../../index';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../../../../api/services/messages-service';
import { FieldProperty } from '../field-properties.interface';

@Component({
    selector: 'dataType-property',
    templateUrl: './data-type.component.html',
})
export class DataTypePropertyComponent extends BaseComponent implements OnInit {
    property: FieldProperty;
    group: FormGroup;
    radioInputs: object = {};

    private propertyRadioList = {
        // Radio inputs: binary, text, date, longText, bool, float, integer
        'com.dotcms.contenttype.model.field.ImmutableRadioField': [{
            text: 'Text',
            value: 'TEXT'
        },
        {
            text: 'True-False',
            value: 'BOOL'
        },
        {
            text: 'Decimal',
            value: 'FLOAT'
        },
        {
            text: 'Whole-Number',
            value: 'INTEGER'
        }],
        'com.dotcms.contenttype.model.field.ImmutableSelectField': [{
            text: 'Text',
            value: 'TEXT'
        },
        {
            text: 'True-False',
            value: 'BOOL'
        },
        {
            text: 'Decimal',
            value: 'FLOAT'
        },
        {
            text: 'Whole-Number',
            value: 'INTEGER'
        }],
        'com.dotcms.contenttype.model.field.ImmutableTextField': [{
            text: 'Text',
            value: 'TEXT'
        },
        {
            text: 'Decimal',
            value: 'FLOAT'
        },
        {
            text: 'Whole-Number',
            value: 'INTEGER'
        }],
    };

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
        this.radioInputs = this.propertyRadioList[this.property.field.clazz];
    }
}
