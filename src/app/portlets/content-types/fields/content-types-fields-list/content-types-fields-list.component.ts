import { FieldService } from '../service';
import { Component, OnInit } from '@angular/core';
import { filter, flatMap, toArray, take } from 'rxjs/operators';

import { FieldType } from '../';

/**
 * Show all the Field Types
 *
 * @export
 * @class FieldTypesContainerComponent
 */
@Component({
    selector: 'dot-content-types-fields-list',
    styleUrls: ['./content-types-fields-list.component.scss'],
    templateUrl: './content-types-fields-list.component.html'
})
export class ContentTypesFieldsListComponent implements OnInit {
    fieldTypes: { clazz: string; name: string }[];

    constructor(public fieldService: FieldService) {}

    ngOnInit(): void {
        this.fieldService
            .loadFieldTypes()
            .pipe(
                flatMap((fields: FieldType[]) => fields),
                filter((field: FieldType) => field.id !== 'tab_divider'),
                toArray(),
                take(1)
            )
            .subscribe((fields: FieldType[]) => {
                this.fieldTypes = fields.map((fieldType: FieldType) => {
                    return {
                        clazz: fieldType.clazz,
                        name: fieldType.label
                    };
                });
            });
    }
}
