import { Component, Input } from '@angular/core';
import { DotcmsConfig } from '../../../api/services/system/dotcms-config';
import { LazyLoadEvent } from 'primeng/primeng';
import { ListingService } from '../../../api/services/listing-service';
import { BaseComponent } from '../_common/_base/base-component';
import { MessageService } from '../../../api/services/messages-service';
import { ButtonAction } from '../_common/action-header/action-header';

@Component({
    selector: 'listing-data-table-component',
    templateUrl: 'listing-data-table-component.html'
})
export class ListingDataTableComponent extends BaseComponent {

    @Input() columns: DataTableColumn[];
    @Input() url: string;
    @Input() buttonActions: ButtonAction[] = [];

    private paginatorRows: number;
    private paginatorLinks: number;
    private items: any[];
    private totalRecords: number;

    // tslint:disable-next-line:no-unused-variable
    private selectedItems = [];

    constructor(private dotcmsConfig: DotcmsConfig, private listingService: ListingService, messageService: MessageService) {
        super(['global-search'], messageService);
    }

    ngOnInit(): void {
        this.dotcmsConfig.getConfig().subscribe(configParams => {
            this.paginatorRows = configParams.paginatorRows;
            this.paginatorLinks = configParams.paginatorLinks;

            this.loadData(this.paginatorRows, -1);
        });
    }

    loadDataPaginationEvent(event: LazyLoadEvent): void {
        this.loadData(event.rows, event.first);
    }

    loadData(limit: number, offset: number): void {
        this.listingService.loadData(this.url, limit, offset)
            .subscribe( response => {
                this.items = response.items;
                this.totalRecords = response.totalRecords;
            });
    }

    getAlign(col: DataTableColumn): string {
        return col.textAlign ? col.textAlign :
            (this.items && typeof this.items[0][col.fieldName] === 'number') ? 'right' : 'left';
    }

    actionHeaderLog(): void {
        console.log('Primary command was triggered');
    }
}

export interface DataTableColumn {
    fieldName: string;
    header: string;
    sortable?: boolean;
    width?: string;
    textAlign?: string;
}