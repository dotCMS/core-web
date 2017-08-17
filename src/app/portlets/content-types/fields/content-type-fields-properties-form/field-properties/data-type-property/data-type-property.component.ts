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
    radioInputs: object = {};

    private readonly propertyRadioList = {
        // Radio inputs: binary, text, date, longText, bool, float, integer
        binary: ['binary'],
        checkbox: ['text'],
        date: ['date'],
        dateAndTime: ['date'],
        select: ['text', 'bool', 'float', 'integer'],
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
        this.propertyRadioList.select.forEach((item) => {
            this.radioInputs[item] = true;
        });
    }

    // setCheckboxLabel(field): string {
    //     return this.map[field] || field;
    // }
}