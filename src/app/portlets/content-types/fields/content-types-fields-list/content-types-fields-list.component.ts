import { Component } from '@angular/core';
import { FieldService, FieldDragDropService } from '../service';
import { Field, FieldType } from '../';
import { PROPERTY_INFO } from '../content-type-fields-properties-form/field-properties/index';

/**
 * Show all the Field Types
 *
 * @export
 * @class FieldTypesContainerComponent
 */
@Component({
    selector: 'content-types-fields-list',
    styles: [require('./content-types-fields-list.component.scss')],
    templateUrl: './content-types-fields-list.component.html',
})
export class ContentTypesFieldsListComponent {
    private fieldTypes: Field[];

    constructor(private fieldService: FieldService, private fieldDragDropService: FieldDragDropService) {

    }

    ngOnInit(): void {
        this.fieldService.loadFieldTypes()
            .subscribe(fields => this.fieldTypes = fields.map(fieldType => {
                let field = {
                    clazz: fieldType.clazz,
                    name: fieldType.label
                };

                fieldType.properties.forEach(property => {
                    if (PROPERTY_INFO[property.toLowerCase()] && property !== 'name') {
                        field[property.toLowerCase()] = '';
                    }
                });

                return field;
            }));

        this.fieldDragDropService.setFieldBagOptions();
    }
}