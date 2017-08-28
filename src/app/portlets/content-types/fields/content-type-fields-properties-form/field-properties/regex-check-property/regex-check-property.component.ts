import { Component, Input, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../../../../api/services/messages-service';
import { FieldProperty } from '../field-properties.interface';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'hint-property',
    templateUrl: './regex-check-property.component.html',
})
export class RegexCheckPropertyComponent extends BaseComponent {

    readonly REGEX_CHECK_TEMPLATE = [
        {
            label: 'Select',
            value: ''
        },
        {
            label: 'Email',
            value: '^([a-zA-Z0-9]+[a-zA-Z0-9._%+-]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4})$'
        },
        {
            label: 'Numbers-only',
            value: '[0-9]*'
        },
        {
            label: 'Letters-only',
            value: '[a-zA-Z\s]*'
        },
        {
            label: 'Alphanumeric',
            value: '[0-9a-zA-Z\s]*'
        },
        {
            label: 'US-Zip-Code',
            value: '(^\d{5}$)|(^\d{5}-\d{4}$)'
        },
        {
            label: 'US-Phone',
            value: '^\(?[1-9]\d{2}[\)\-]\s?\d{3}\-\d{4}$'
        },
        {
            label: 'URL-Pattern',
            // tslint:disable-next-line:max-line-length
            value: '^((http|ftp|https):\/\/w{3}[\d]*.|(http|ftp|https):\/\/|w{3}[\d]*.)([\w\d\._\-#\(\)\[\]\,;:]+@[\w\d\._\-#\(\)\[\]\,;:])?([a-z0-9]+.)*[a-z\-0-9]+.([a-z]{2,3})?[a-z]{2,6}(:[0-9]+)?(\/[\/a-zA-Z0-9\._\-,\%\s]+)*(\/|\?[a-z0-9=%&\.\-,#]+)?$'
        },
        {
            label: 'No-HTML',
            value: '[^(<[.\n]+>)]*'
        }
    ];

    property: FieldProperty;
    group: FormGroup;

    constructor(public messageService: MessageService) {
        super(['Validation-RegEx'], messageService);
    }

    templateSelect(event): void {
        this.group.controls[this.property.name].setValue(event.value);
    }
}
