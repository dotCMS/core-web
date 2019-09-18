import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { DotTagsService } from '@services/dot-tags/dot-tags.service';
import { DotTag } from '@models/dot-tag';
import { filter, mergeMap, take, toArray } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * The DotAutocompleteTagsComponent provide a dropdown to select tags,
 * the output is an array of DotTag.
 * @export
 * @class DotAutocompleteTagsComponent
 */
@Component({
    selector: 'dot-autocomplete-tags',
    templateUrl: './dot-autocomplete-tags.component.html',
    styleUrls: ['./dot-autocomplete-tags.component.css'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotAutocompleteTagsComponent)
        }
    ]
})
export class DotAutocompleteTagsComponent implements OnInit, ControlValueAccessor {
    @Input() placeholder: string;
    @Input() inputId: string;
    // @Output() onChange = new EventEmitter<string[]>();

    value: DotTag[] = [];
    filteredOptions: DotTag[];
    disabled = false;

    constructor(private dotTagsService: DotTagsService) {}

    propagateChange = (_: any) => {};

    ngOnInit() {
        this.filterTags();
    }

    /**
     * Return the list of tags based on a filter and
     * checking if is not selected already.
     *
     * @param any event
     * @memberof DotAutocompleteTagsComponent
     */
    filterTags(event?: { originalEvent: Event; query: string }): void {
        this.dotTagsService
            .getSuggestions(event ? event.query : '')
            .pipe(
                take(1),
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
        debugger;
        const input: HTMLInputElement = event.currentTarget as HTMLInputElement;
        if (event.key === 'Enter' && this.isUniqueTag(input.value)) {
            this.value.push({ label: input.value });
            this.propagateChange(this.value);
            // this.onChange.emit(this.value);
            input.value = null;
        }
    }

    /**
     * Add new item when is selected in the p-autocomplete dropdown.
     *
     * @param DotTag tag
     * @memberof DotAutocompleteTagsComponent
     */
    addItem(): void {
        debugger;
        this.propagateChange(this.value);
        // this.value.splice(-1, 1);
        // if (this.isUniqueTag(tag.label)) {
        //     this.value.push(tag.label);
        // this.onChange.emit(this.value);
        // }
    }

    /**
     * Add new item when is selected in the p-autocomplete dropdown.
     *
     * @memberof DotAutocompleteTagsComponent
     */
    removeItem(): void {
        this.propagateChange(this.value);
        // this.onChange.emit(this.value);
    }
    /**
     * Set the function to be called when the control receives a change event.
     *
     * @param * fn
     * @memberof DotAutocompleteTagsComponent
     */
    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    /**
     * Write a new value to the element
     *
     * @param string[] value
     * @memberof DotAutocompleteTagsComponent
     */
    writeValue(value: DotTag[]): void {
        this.value = value ? value : [];
    }

    /**
     * Set the function to be called when the control set disable stage.
     *
     * @param boolean isDisabled
     * @memberof DotAutocompleteTagsComponent
     */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    registerOnTouched(): void {}

    private isUniqueTag(label: string): boolean {
        return !!label && !this.value.filter((tag: DotTag) => tag.label === label);
    }
}
