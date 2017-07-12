import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Field } from '../service';

/**
 * It is a Field after been Drag and Drop int a Content Type Drop zone
 *
 * @export
 * @class ContentTypesFieldDragabbleItemComponent
 */
@Component({
    selector: 'content-type-field-dragabble-item',
    templateUrl: './content-type-field-dragabble-item.component.html',
})
export class ContentTypesFieldDragabbleItemComponent {
    @Input() field: Field;
    @Output() remove: EventEmitter<Field> = new EventEmitter();

}