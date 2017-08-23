import { Injectable, ComponentFactory, Type } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RequestMethod } from '@angular/http';
import { CoreWebService } from '../../../../api/services/core-web-service';
import { FieldService } from './index';
import { FieldType } from '../index';
import { PROPERTY_INFO } from './field-property-info';
import { DATA_TYPE_PROPERTY_INFO } from './data-type-property-info';

/**
 * Provide method to handle with the Field Types's properties
 */
@Injectable()
export class FieldPropertyService {
    private fieldTypesProperties = new Map<string, string[]>();

    constructor(private coreWebService: CoreWebService, fieldService: FieldService) {
        fieldService.loadFieldTypes().subscribe(fieldTypes => {
            fieldTypes.forEach(fieldType => {
                this.fieldTypesProperties.set(fieldType.clazz, fieldType.properties);
            });
        });
    }

    existsInfo(propertyName: string): boolean {
        return PROPERTY_INFO[propertyName];
    }

    getComponent(propertyName: string): Type<any> {
        return PROPERTY_INFO[propertyName].component;
    }

    getDefaultValue(propertyName: string, fieldTypeClass?: string): any {
        if (propertyName === 'dataType') {
            return DATA_TYPE_PROPERTY_INFO[fieldTypeClass][0].value;
        } else {
            return PROPERTY_INFO[propertyName].defaultValue;
        }
    }

    getOrder(propertyName: string): any {
        return PROPERTY_INFO[propertyName].order;
    }

    isRequired(propertyName: string): boolean {
        return PROPERTY_INFO[propertyName].required;
    }

    isDisabledInEditMode(propertyName: string): boolean {
        return PROPERTY_INFO[propertyName].disabledInEdit;
    }

    getProperties(fieldTypeClass: string): string[] {
        return this.fieldTypesProperties.get(fieldTypeClass);
    }

    getDataTypeValues(fieldTypeClass: string): string[] {
        return DATA_TYPE_PROPERTY_INFO[fieldTypeClass];
    }
}
