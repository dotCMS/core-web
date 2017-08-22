import { Injectable, ComponentFactory, Type } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RequestMethod } from '@angular/http';
import { CoreWebService } from '../../../../api/services/core-web-service';
import {
    CategoriesPropertyComponent,
    DataTypePropertyComponent,
    DefaultValuePropertyComponent,
    HintPropertyComponent,
    CheckboxPropertyComponent,
    NamePropertyComponent,
    RegexCheckPropertyComponent,
    ValuesPropertyComponent
} from '../content-type-fields-properties-form/field-properties';

/**
 * Provide method to handle with the Field Types
 */
@Injectable()
export class FieldPropertyService {
    readonly PROPERTY_INFO = {
        categories: {
            component: CategoriesPropertyComponent,
            defaultValue: '',
            order: 2,
            required: true
        },
        dataType: {
            component: DataTypePropertyComponent,
            defaultValue: '',
            order: 1
        },
        defaultValue: {
            component: DefaultValuePropertyComponent,
            defaultValue: '',
            order: 4
        },
        hint: {
            component: HintPropertyComponent,
            defaultValue: '',
            order: 5
        },
        indexed: {
            component: CheckboxPropertyComponent,
            defaultValue: false,
            order: 9
        },
        listed: {
            component: CheckboxPropertyComponent,
            defaultValue: false,
            order: 10
        },
        name: {
            component: NamePropertyComponent,
            defaultValue: '',
            order: 0,
            required: true
        },
        regexCheck: {
            component: RegexCheckPropertyComponent,
            defaultValue: '',
            order: 6
        },
        required: {
            component: CheckboxPropertyComponent,
            defaultValue: false,
            order: 7
        },
        searchable: {
            component: CheckboxPropertyComponent,
            defaultValue: false,
            order: 8
        },
        unique: {
            component: CheckboxPropertyComponent,
            defaultValue: false,
            order: 11
        },
        values: {
            component: ValuesPropertyComponent,
            defaultValue: '',
            order: 3,
            required: true
        },
    };

    constructor(private coreWebService: CoreWebService) {

    }

    existsInfo(propertyName: string): boolean {
        return this.PROPERTY_INFO[propertyName];
    }

    getComponent(propertyName: string): Type<any> {
        return this.PROPERTY_INFO[propertyName].component;
    }

    getDefaultValue(propertyName: string): any {
        return this.PROPERTY_INFO[propertyName].defaultValue;
    }

    getOrder(propertyName: string): any {
        return this.PROPERTY_INFO[propertyName].order;
    }

    isRequired(propertyName: string): boolean {
        return this.PROPERTY_INFO[propertyName].required;
    }
}
