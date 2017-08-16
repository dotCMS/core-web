import { Component, Input } from '@angular/core';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../../../../api/services/messages-service';
import { FieldProperty } from '../field-properties.interface';

@Component({
    selector: 'categories-property',
    templateUrl: './categories-property.component.html',
})
export class CategoriesPropertyComponent extends BaseComponent {
    categories: any[];
    property: FieldProperty;

    constructor(public messageService: MessageService) {
        super(
            [
                'categories',
            ],
            messageService
        );
    }

    ngOnInit(): void {
    }
}