import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DotPageSelectorService, DotPageAsset } from './service/dot-page-selector.service';

/**
 * Search and select a page asset
 *
 * @export
 * @class DotPageSelectorComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'dot-page-selector',
    templateUrl: './dot-page-selector.component.html',
    styleUrls: ['./dot-page-selector.component.scss']
})
export class DotPageSelectorComponent implements OnInit {
    @Output() selected = new EventEmitter<DotPageAsset>();
    results: any[];

    constructor(private dotPageSelectorService: DotPageSelectorService) {}

    ngOnInit() {}


    /**
     * Handle option selected
     *
     * @param {*} $event
     * @memberof DotPageSelectorComponent
     */
    onSelect(item: DotPageAsset): void {
        this.selected.emit(item);
    }

    /**
     * Get pages results and set it to the autotomplete
     *
     * @param {*} $event
     * @memberof DotPageSelectorComponent
     */
    search(query: string): void {
        if (query) {
            this.dotPageSelectorService.getPagesInFolder(query).subscribe((pages: DotPageAsset[]) => {
                this.results = pages;
            });
        } else {
            this.results = [];
        }
    }
}
