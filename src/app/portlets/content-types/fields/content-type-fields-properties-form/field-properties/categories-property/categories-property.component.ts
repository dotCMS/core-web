import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../../../../api/services/messages-service';
import { FieldProperty } from '../field-properties.interface';
import { Observable } from 'rxjs/Rx';
import { PaginatorService } from '../../../../../../api/services/paginator';
import { FormGroup } from '@angular/forms';
import { Category } from '../../../shared/category';

/**
 * List all the categories and allow select one.
 * 
 * @export
 * @class CategoriesPropertyComponent
 * @extends {BaseComponent}
 * @implements {OnInit}
 */
@Component({
    providers: [
        PaginatorService,
    ],
    selector: 'categories-property',
    templateUrl: './categories-property.component.html',
})
export class CategoriesPropertyComponent extends BaseComponent implements OnInit {
    categoriesCurrentPage: Category[];
    property: FieldProperty;
    group: FormGroup;

    constructor(public messageService: MessageService, private paginationService: PaginatorService) {
        super(['categories', 'Select'], messageService);
    }

    ngOnInit(): void {
        this.paginationService.url = '/v1/categories';
    }

    /**
     * Call to load a new page of categories.
     * @param {string} [filter='']
     * @param {number} [page=1]
     * @memberof SiteSelectorComponent
     */
    private getCategoriesList(filter = '', offset = 0): void {
        this.paginationService.filter = filter;
        this.paginationService.getWithOffset(offset).subscribe(items => {
            // items.splice(0) is used to return a new object and trigger the change detection in angular
            this.categoriesCurrentPage = items.splice(0);
        });
    }

    /**
     * Call when the categories global serach changed
     * @param {any} filter
     * @memberof CategoriesPropertyComponent
     */
    handleFilterChange(filter): void {
        this.getCategoriesList(filter);
    }

    /**
     * Call when the current page changed
     * @param {any} event
     * @memberof CategoriesPropertyComponent
     */
    handlePageChange(event): void {
        this.getCategoriesList(event.filter, event.first);
    }
}
