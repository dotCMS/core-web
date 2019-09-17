import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotTagsService } from '@services/dot-tags/dot-tags.service';
import { DotTag } from '@models/dot-tag';
import { filter, mergeMap, toArray } from 'rxjs/operators';

/**
 * The DotAutocompleteTagsComponent provide a dropdown to select tags,
 * the output is an array of strings with the labels.
 * @export
 * @class DotAutocompleteTagsComponent
 */
@Component({
    selector: 'dot-autocomplete-tags',
    templateUrl: './dot-autocomplete-tags.component.html',
    styleUrls: ['./dot-autocomplete-tags.component.css']
})
export class DotAutocompleteTagsComponent implements OnInit {
    @Input() inputId: string;
    @Input() value: string[] = [];
    @Input() placeholder: string;

    @Output() onChange = new EventEmitter<any>();

    filteredOptions: DotTag[];

    constructor(private dotTagsService: DotTagsService) {}

    ngOnInit() {
        this.filterTags();
        this.value = this.value === null ? [] : this.value;
    }

    /**
     * Return the list of tags based on a filter and
     * checking if is not selected already.
     *
     * @param any event
     * @memberof DotAutocompleteTagsComponent
     */
    filterTags(event?: any): void {
        this.dotTagsService
            .get(event ? event.query : '')
            .pipe(
                mergeMap((tags: DotTag[]) => tags),
                filter((tag: DotTag) => this.isUniqueTag(tag.label)),
                toArray<DotTag>()
            )
            .subscribe((tags: DotTag[]) => {
                this.filteredOptions = tags;
            });
    }

    /**
     * Check if the user wants to add a new tag when hit enter.
     *
     * @param KeyboardEvent event
     * @memberof DotAutocompleteTagsComponent
     */
    checkForTag(event: KeyboardEvent): void {
        const input: HTMLInputElement = event.currentTarget as HTMLInputElement;
        if (event.key === 'Enter' && this.isUniqueTag(input.value)) {
            this.value.push(input.value);
            this.onChange.emit(this.value);
            input.value = null;
        }
    }

    /**
     * Add new item when is selected in the p-autocomplete dropdown.
     *
     * @param DotTag tag
     * @memberof DotAutocompleteTagsComponent
     */
    addItem(tag: DotTag): void {
        this.value.splice(-1, 1);
        if (this.isUniqueTag(tag.label)) {
            this.value.push(tag.label);
            this.onChange.emit(this.value);
        }
    }

    /**
     * Add new item when is selected in the p-autocomplete dropdown.
     *
     * @param DotTag tag
     * @memberof DotAutocompleteTagsComponent
     */
    removeItem(): void {
        this.onChange.emit(this.value);
    }

    private isUniqueTag(tag: string): boolean {
        return !!tag && !this.value.includes(tag);
    }
}
