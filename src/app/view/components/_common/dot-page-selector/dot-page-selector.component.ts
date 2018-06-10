import { Component, Output, EventEmitter, forwardRef } from '@angular/core';
import { DotPageSelectorService, DotPageAsset } from './service/dot-page-selector.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { take } from 'rxjs/operators';

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
    styleUrls: ['./dot-page-selector.component.scss'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotPageSelectorComponent)
        }
    ]
})
export class DotPageSelectorComponent implements ControlValueAccessor {
    @Output() selected = new EventEmitter<DotPageAsset>();
    results: any[];
    val: DotPageAsset;

    constructor(private dotPageSelectorService: DotPageSelectorService) {}

    propagateChange = (_: any) => {};

    /**
     * Handle option selected
     *
     * @param {*} $event
     * @memberof DotPageSelectorComponent
     */
    onSelect(item: DotPageAsset): void {
        this.selected.emit(item);
        this.propagateChange(item);
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

    /**
     * Write a new value to the element
     *
     * @param {string} idenfier
     * @memberof DotPageSelectorComponent
     */
    writeValue(idenfier: string): void {
        this.dotPageSelectorService.getPage(idenfier).pipe(take(1)).subscribe((page: DotPageAsset) => {
            this.val = page;
        });
    }

    /**
     * Set the function to be called when the control receives a change event.
     *
     * @param {*} fn
     * @memberof DotPageSelectorComponent
     */
    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {

    }
}
