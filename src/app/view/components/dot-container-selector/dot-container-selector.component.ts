import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';

import { PaginatorService } from '@services/paginator/paginator.service';
import { DotTemplateContainersCacheService } from '@services/dot-template-containers-cache/dot-template-containers-cache.service';

import { DotContainerColumnBox } from '@models/dot-edit-layout-designer';
import { DotContainer } from '@models/container/dot-container.model';

@Component({
    selector: 'dot-container-selector',
    templateUrl: './dot-container-selector.component.html',
    styleUrls: ['./dot-container-selector.component.scss']
})
export class DotContainerSelectorComponent implements OnInit {
    @Output() change: EventEmitter<DotContainer> = new EventEmitter();

    @Input() data: DotContainerColumnBox[] = [];
    @Input() innerClass = '';

    totalRecords: number;
    currentContainers: DotContainer[] = [];

    constructor(
        public paginationService: PaginatorService,
        private templateContainersCacheService: DotTemplateContainersCacheService,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.paginationService.url = 'v1/containers';
        this.paginationService.paginationPerPage = 5;
    }

    /**
     * Called when the selected site changed and the change event is emmited
     *
     * @param DotContainer container
     * @memberof DotContainerSelectorComponent
     */
    containerChange(container: DotContainer): void {
        this.change.emit(container);
    }

    /**
     * Call to handle filter containers from list
     *
     * @param string filter
     * @memberof DotContainerSelectorComponent
     */
    handleFilterChange(filter: string): void {
        this.getContainersList(filter);
    }

    /**
     * Call when the current page changed
     * @param any event
     * @memberof DotContainerSelectorComponent
     */
    handlePageChange(event: any): void {
        console.log('handlePageChange', event.filter, event.first);
        this.getContainersList(event.filter, event.first);
    }

    private getContainersList(filter = '', offset = 0): void {
        console.log('getContainersList');
        this.paginationService.filter = filter;
        this.paginationService.getWithOffset(offset).subscribe((items) => {
            this.currentContainers = this.setIdentifierReference(items.splice(0));
            this.totalRecords = this.totalRecords || this.paginationService.totalRecords;
            this.cd.detectChanges();
        });
    }

    private setIdentifierReference(items: DotContainer[]): any {
        return items.map((dotContainer) => {
            dotContainer.identifier = this.templateContainersCacheService.getContainerReference(
                dotContainer
            );
            return dotContainer;
        });
    }
}
