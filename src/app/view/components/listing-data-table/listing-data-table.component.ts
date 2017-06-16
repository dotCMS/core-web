import { BaseComponent } from '../_common/_base/base-component';
import { ActionHeaderOptions } from './action-header/action-header';
import { Component, Input, Output } from '@angular/core';
import { CrudService, OrderDirection } from '../../../api/services/crud';
import { DotcmsConfig } from '../../../api/services/system/dotcms-config';
import { FormatDateService } from '../../../api/services/format-date-service';
import { LazyLoadEvent } from 'primeng/primeng';
import { LoggerService } from '../../../api/services/logger.service';
import { MessageService } from '../../../api/services/messages-service';
import { EventEmitter } from '@angular/core';
@Component({
    selector: 'listing-data-table',
    styles: [require('./listing-data-table.component.scss')],
    templateUrl: 'listing-data-table.component.html'
})
export class ListingDataTableComponent extends BaseComponent {

    @Input() columns: DataTableColumn[];
    @Input() url: string;
    @Input() actionHeaderOptions: ActionHeaderOptions;
    @Input() buttonActions: ButtonAction[] = [];
    @Input() defaultSortOrder: string;
    @Input() defaultSortField: string;
    @Output() rowWasClicked: EventEmitter<any> = new EventEmitter;

    private paginatorRows: number;
    private paginatorLinks: number;
    private items: any[];
    private totalRecords: number;
    private query = '';
    private sortField: string;
    private selectedItems = [];

    constructor(private dotcmsConfig: DotcmsConfig, private crudService: CrudService,
    messageService: MessageService, public loggerService: LoggerService, private formatDateService: FormatDateService) {
        super(['global-search'], messageService);
    }

    ngOnInit(): void {
        this.dotcmsConfig.getConfig().subscribe(configParams => {
            this.paginatorRows = configParams.paginatorRows;
            this.paginatorLinks = configParams.paginatorLinks;
            this.loadData(this.paginatorRows, -1);
        });

        this.sortField = this.defaultSortField;
    }

    handleRowClick($event): void {
        this.rowWasClicked.emit($event);
    }

    /**
     * Call when click on any pagination link
     * @param event Pagination event
     */
    loadDataPaginationEvent(event: LazyLoadEvent): void {
        this.loadData(event.rows, event.first, event.sortField, event.sortOrder, this.query);
    }

    /**
     * Load data from the server
     * @param {number} limit limit of items
     * @param {number} offset items offset
     * @param {number} sortField
     * @param {number} sortOrder
     * @param {number} query
     * @memberof ListingDataTableComponent
     */
    loadData(limit: number, offset: number, sortField?: string, sortOrder?: number, query?: string): void {
        if (this.defaultSortOrder) {
            sortField = this.defaultSortOrder;
        }
        this.crudService.loadData(this.url, limit, offset, sortField, sortOrder < 0 ? OrderDirection.DESC : OrderDirection.ASC, query)
            .subscribe((response) => {
                this.formatData(response);
            });
    }

    /**
     * Column align, return the DataTableColumn's textAlign property if it exists,
     * otherwise return right if the content is number and left if the content's type is not number.
     * @param {DataTableColumn} col
     * @returns {string}
     * @memberof ListingDataTableComponent
     */
    getAlign(col: DataTableColumn): string {
        return col.textAlign ? col.textAlign :
            (this.items && this.items[0] && typeof this.items[0][col.fieldName] === 'number') ? 'right' : 'left';
    }

     private formatData(data: any): void {
        this.items = data.items.map((item) => {
            this.columns.forEach((col) => {
                if (col.format === 'date') {
                    item[col.fieldName] = this.formatDateService.getModDate(item[col.fieldName]);
                }
            });
            return item;
        });

        this.totalRecords = data.totalRecords;
    }
}

export interface DataTableColumn {
    fieldName: string;
    header: string;
    sortable?: boolean;
    width?: string;
    textAlign?: string;
    format?: string;
}