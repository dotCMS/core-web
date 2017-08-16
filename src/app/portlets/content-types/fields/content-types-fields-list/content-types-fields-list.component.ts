import { Component } from '@angular/core';
import { FieldService, FieldDragDropService, FieldPropertyService } from '../service';
import { Field, FieldType } from '../';

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

    constructor(private fieldService: FieldService, private fieldDragDropService: FieldDragDropService,
        private fieldPropertyService: FieldPropertyService) {

    }

    ngOnInit(): void {
        this.fieldService.loadFieldTypes()
            .subscribe(fields => this.fieldTypes = fields.map(fieldType => {
                let field = {
                    clazz: fieldType.clazz,
                    name: fieldType.label
                };

                fieldType.properties.forEach(property => {
                    if (this.fieldPropertyService.existsInfo(property) && !field[property]) {
                        field[property] = this.fieldPropertyService.getDefaultValue(property);
                    }
                });

                return field;
            }));

        this.fieldDragDropService.setFieldBagOptions();
    }
}