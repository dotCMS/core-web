import { FieldService, FieldDragDropService, FieldPropertyService } from '../service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FIELD_ICONS } from './content-types-fields-icon-map';
import { Field, FieldType } from '../';

/**
 * Show all the Field Types
 *
 * @export
 * @class FieldTypesContainerComponent
 */
@Component({
    selector: 'content-types-fields-list',
    styleUrls: ['./content-types-fields-list.component.scss'],
    templateUrl: './content-types-fields-list.component.html'
})
export class ContentTypesFieldsListComponent implements  OnInit {
    fieldTypes: Field[];

    constructor(private fieldService: FieldService, private fieldDragDropService: FieldDragDropService,
        private fieldPropertyService: FieldPropertyService) {

    }

    ngOnInit(): void {
        this.fieldService.loadFieldTypes()
            .subscribe(fields => this.fieldTypes = fields.map(fieldType => {
                console.log('fieldType: ', fieldType);
                const field = {
                    clazz: fieldType.clazz,
                    name: fieldType.label
                };

                return field;
            }));

            this.fieldDragDropService.setFieldBagOptions();
    }


    getIcon(id: string): string {
        return FIELD_ICONS[id];
    }
}
