import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    ViewChild,
    ElementRef,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ContentChildren,
    QueryList,
    ContentChild,
    SimpleChange
} from '@angular/core';
import { LazyLoadEvent, PrimeTemplate } from 'primeng/api';
import { Table } from 'primeng/table';
import { ActionHeaderOptions, ButtonAction } from '@models/action-header';
import { DataTableColumn } from '@models/data-table/data-table-column';
import { LoggerService } from 'dotcms-js';
import { FormatDateService } from '@services/format-date-service';
import { PaginatorService, OrderDirection } from '@services/paginator';
import { DotDataTableAction } from '@models/data-table/dot-data-table-action';
import { take } from 'rxjs/operators';

function tableFactory(dotListingDataTableComponent: DotListingDataTableComponent) {
    return dotListingDataTableComponent.dataTable;
}

@Component({
    providers: [
        PaginatorService,
        {
            provide: Table,
            useFactory: tableFactory,
            deps: [DotListingDataTableComponent]
        }
    ],
    selector: 'dot-listing-data-table',
    styleUrls: ['./dot-listing-data-table.component.scss'],
    templateUrl: 'dot-listing-data-table.component.html'
})
export class DotListingDataTableComponent implements OnChanges, OnInit {
    @Input() columns: DataTableColumn[];
    @Input() url: string;
    @Input() actionHeaderOptions: ActionHeaderOptions;
    @Input() buttonActions: ButtonAction[] = [];
    @Input() sortOrder: string;
    @Input() sortField: string;
    @Input() multipleSelection = false;
    @Input() paginationPerPage = 40;
    @Input() actions: DotDataTableAction[];
    @Input() dataKey = '';
    @Input() checkbox = false;
    @Input() firstPageData: any[];

    @Output() rowWasClicked: EventEmitter<any> = new EventEmitter();
    @Output() selectedItems: EventEmitter<any> = new EventEmitter();

    @ViewChild('gf', { static: true })
    globalSearch: ElementRef;
    @ViewChild('dataTable', { static: true })
    dataTable: Table;

    @ContentChildren(PrimeTemplate) templates: QueryList<ElementRef>;

    @ContentChild('rowTemplate') rowTemplate: TemplateRef<any>;
    @ContentChild('headerTemplate') headerTemplate: TemplateRef<any>;

    readonly DATE_FORMAT = 'date';
    items: any[];
    selected: any[];
    filter;
    dateColumns: DataTableColumn[];
    loading = true;

    constructor(
        public loggerService: LoggerService,
        public paginatorService: PaginatorService,
        private formatDateService: FormatDateService
    ) {
        this.paginatorService.url = this.url;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.urlChanges(changes.url);
        this.columnChanges(changes.columns);
        this.paginationPerPagesChanges(changes.paginationPerPage);
    }

    ngOnInit(): void {
        this.globalSearch.nativeElement.focus();
    }

    /**
     * Emit checked rows.
     *
     * @memberof DotListingDataTableComponent
     */
    handleRowCheck(): void {
        this.selectedItems.emit(this.selected);
    }

    /**
     * Emit selected row
     * @param {any} rowData
     *
     * @memberof DotListingDataTableComponent
     */
    handleRowClick(rowData: any): void {
        this.rowWasClicked.emit(rowData);
    }

    /**
     * Call when click on any pagination link
     * @param {LazyLoadEvent} event
     *
     * @memberof DotListingDataTableComponent
     */
    loadDataPaginationEvent(event: LazyLoadEvent): void {
        this.loadData(event.first, event.sortField, event.sortOrder);
    }

    /**
     * Request the data to the paginator service.
     * @param {number} offset
     * @param {string} sortFieldParam
     * @param {OrderDirection} sortOrderParam
     *
     * @memberof DotListingDataTableComponent
     */
    loadData(offset: number, sortFieldParam?: string, sortOrderParam?: OrderDirection): void {
        this.loading = true;
        if (this.columns) {
            const { sortField, sortOrder } = this.setSortParams(sortFieldParam, sortOrderParam);
            this.paginatorService.filter = this.filter;
            this.paginatorService.sortField = sortField;
            this.paginatorService.sortOrder =
                sortOrder === 1 ? OrderDirection.ASC : OrderDirection.DESC;
            this.getPage(offset);
        }
    }

    /**
     * Load first page of results and reset the pagination url's and set the table pagination.
     *
     * @memberof DotListingDataTableComponent
     */
    loadFirstPage(): void {
        this.loading = true;
        this.paginatorService
            .get()
            .pipe(take(1))
            .subscribe(items => {
                this.setItems(items);
                this.dataTable.first = 1;
            });
    }

    /**
     * Reloads data table with updated data on current page
     * @memberof DotListingDataTableComponent
     */
    loadCurrentPage(): void {
        this.loading = true;
        if (this.columns) {
            this.paginatorService
                .getCurrentPage()
                .pipe(take(1))
                .subscribe(items => this.setItems(items));
        }
    }

    /**
     * Column align, return the DataTableColumn's textAlign property if it exists,
     * otherwise return right if the content is number and left if the content's type is not number.
     * @param {DataTableColumn} col
     * @returns string
     * @memberof DotListingDataTableComponent
     */
    getAlign(col: DataTableColumn): string {
        return col.textAlign ? col.textAlign : this.isTypeNumber(col) ? 'right' : 'left';
    }

    /**
     * Focus the fist row of the table is there are results.
     * @memberof ListingDataTableComponent
     */
    focusFirstRow(): void {
        const rows: HTMLTableRowElement[] = this.dataTable.tableViewChild.nativeElement.rows;
        if (rows.length > 1) {
            rows[1].focus();
        }
    }

    private formatData(items: any[]): any[] {
        return items.map(item => {
            this.dateColumns.forEach(
                col =>
                    (item[col.fieldName] = this.formatDateService.getRelative(item[col.fieldName]))
            );
            return item;
        });
    }

    private setItems(items: any[]): void {
        this.items = this.dateColumns ? this.formatData(items) : items;
        this.loading = false;
    }

    private isTypeNumber(col: DataTableColumn): boolean {
        return this.items && this.items[0] && typeof this.items[0][col.fieldName] === 'number';
    }

    private setSortParams(sortFieldParam?: string, sortOrderParam?: OrderDirection) {
        return {
            sortField: sortFieldParam || this.sortField,
            sortOrder: sortOrderParam || this.sortOrder
        };
    }

    private getPage(offset: number): void {
        if (offset === 0 && this.firstPageData) {
            this.setItems(this.firstPageData);
        } else {
            this.paginatorService
                .getWithOffset(offset)
                .pipe(take(1))
                .subscribe(items => this.setItems(items));
        }
    }

    private urlChanges(url: SimpleChange): void {
        if (url && url.currentValue) {
            this.paginatorService.url = url.currentValue;
        }
    }

    private columnChanges(columns: SimpleChange): void {
        if (columns && columns.currentValue) {
            this.dateColumns = columns.currentValue.filter(
                column => column.format === this.DATE_FORMAT
            );
            this.loadData(0);
        }
    }

    private paginationPerPagesChanges(paginationPerPage: SimpleChange): void {
        if (paginationPerPage && paginationPerPage.currentValue) {
            this.paginatorService.paginationPerPage = this.paginationPerPage;
        }
    }
}
