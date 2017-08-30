import { Component, Input, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../../../../api/services/messages-service';
import { FieldProperty } from '../field-properties.model';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'hint-property',
    templateUrl: './regex-check-property.component.html',
})
export class RegexCheckPropertyComponent extends BaseComponent {

    static REGEX_CHECK_TEMPLATE = [
        {
            label: 'contenttypes.field.properties.Validation_RegEx.values.select',
            value: ''
        },
        {
            label: 'contenttypes.field.properties.Validation_RegEx.values.email',
            value: '^([a-zA-Z0-9]+[a-zA-Z0-9._%+-]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4})$'
        },
        {
            label: 'contenttypes.field.properties.Validation_RegEx.values.numbers_only',
            value: '[0-9]*'
        },
        {
            label: 'contenttypes.field.properties.Validation_RegEx.values.letters_only',
            value: '[a-zA-Z\s]*'
        },
        {
            label: 'contenttypes.field.properties.Validation_RegEx.values.alphanumeric',
            value: '[0-9a-zA-Z\s]*'
        },
        {
            label: 'contenttypes.field.properties.Validation_RegEx.values.us_zip_code',
            value: '(^\d{5}$)|(^\d{5}-\d{4}$)'
        },
        {
            label: 'contenttypes.field.properties.Validation_RegEx.values.us_phone',
            value: '^\(?[1-9]\d{2}[\)\-]\s?\d{3}\-\d{4}$'
        },
        {
            label: 'contenttypes.field.properties.Validation_RegEx.values.url_pattern',
            // tslint:disable-next-line:max-line-length
            value: '^((http|ftp|https):\/\/w{3}[\d]*.|(http|ftp|https):\/\/|w{3}[\d]*.)([\w\d\._\-#\(\)\[\]\,;:]+@[\w\d\._\-#\(\)\[\]\,;:])?([a-z0-9]+.)*[a-z\-0-9]+.([a-z]{2,3})?[a-z]{2,6}(:[0-9]+)?(\/[\/a-zA-Z0-9\._\-,\%\s]+)*(\/|\?[a-z0-9=%&\.\-,#]+)?$'
        },
        {
            label: 'contenttypes.field.properties.Validation_RegEx.values.no_html',
            value: '[^(<[.\n]+>)]*'
        }
    ];

    property: FieldProperty;
    group: FormGroup;

    constructor(public messageService: MessageService) {
        super(
            [
                'contenttypes.field.properties.Validation_RegEx.label',
                ...RegexCheckPropertyComponent.REGEX_CHECK_TEMPLATE.map(template => template.label)
            ], messageService);
    }

    templateSelect(event): void {
        this.group.controls[this.property.name].setValue(event.value);
    }

    onMessage(): void {
        RegexCheckPropertyComponent.REGEX_CHECK_TEMPLATE.forEach(template => template.label = this.i18nMessages[template.label ]);
    }
}
