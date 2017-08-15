import { Component } from '@angular/core';
import { FieldService, FieldDragDropService } from '../service';
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
    // fieldProperties: string[];
    private fieldTypes: Field[]; // actualizar el tipo para tener properties

    constructor(private fieldService: FieldService, private fieldDragDropService: FieldDragDropService) {

    }

    ngOnInit(): void {
        this.fieldService.loadFieldTypes()
            .subscribe(fields => this.fieldTypes = fields.map(fieldType => {
                return {
                    categories: ['Cateforie One', 'Cateforie two', 'Cateforie three'],
                    clazz: fieldType.clazz,
                    name: fieldType.label,
                };
            }));

        this.fieldDragDropService.setFieldBagOptions();
    }
}