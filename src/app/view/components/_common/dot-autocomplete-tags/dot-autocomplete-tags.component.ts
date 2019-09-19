import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { DotTagsService } from '@services/dot-tags/dot-tags.service';
import { DotTag } from '@models/dot-tag';
import { take } from 'rxjs/operators';
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
    styleUrls: ['./dot-autocomplete-tags.component.scss'],
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

    value: DotTag[] = [];
    filteredOptions: DotTag[];
    disabled = false;

    private lastDeletedTag: DotTag;

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
    filterTags(event?: { originalEvent?: Event; query: string }): void {
        this.dotTagsService
            .getSuggestions(event ? event.query : '')
            .pipe(take(1))
            .subscribe((tags: DotTag[]) => {
                this.filteredOptions = tags.filter((tag: DotTag) => this.isUniqueTag(tag.label));
            });
    }

    /**
     * Check if the user wants to add a new tag when hit enter.
     *
     * @param KeyboardEvent event
     * @memberof DotAutocompleteTagsComponent
     */
    checkForTag(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.addItemOnEnter(event.currentTarget as HTMLInputElement);
        } else if (event.key === 'Backspace') {
            //  PrimeNG p-autoComplete remove elements on Backspace keydown, we don't want that in our component so we're fixing this here.
            this.recoverDeletedElement();
        }
    }

    /**
     * Add new item when is selected in the p-autocomplete dropdown and propagate change
     *
     * @param DotTag tag
     * @memberof DotAutocompleteTagsComponent
     */
    addItem(): void {
        this.value.unshift(this.value.pop());
        this.propagateChange(this.getStringifyLabels());
    }

    /**
     * After item is removed in the p-autocomplete dropdown, propagate change and set lastDeletedTag
     *
     * @memberof DotAutocompleteTagsComponent
     */
    removeItem(tag: DotTag): void {
        this.propagateChange(this.getStringifyLabels());
        this.lastDeletedTag = tag;
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
     * Receive strings separated by comma and covert that
     * to DotTag[]
     *
     * @param string[] value
     * @memberof DotAutocompleteTagsComponent
     */
    writeValue(labels: string): void {
        this.value = labels
            ? labels.split(',').map((text: string) => {
                  return this.createNewTag(text);
              })
            : [];
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
        return !!label && !this.value.filter((tag: DotTag) => tag.label === label).length;
    }

    private getStringifyLabels(): string {
        return this.value.map((tag: DotTag) => tag.label).join(',');
    }

    private addItemOnEnter(input: HTMLInputElement): void {
        if (this.isUniqueTag(input.value)) {
            this.value.unshift(this.createNewTag(input.value));
            this.propagateChange(this.getStringifyLabels());
            this.filterTags({ query: input.value });
            input.value = null;
        }
    }

    private recoverDeletedElement(): void {
        this.value.push(this.lastDeletedTag);
    }

    private createNewTag(label: string): DotTag {
        return {
            label: label,
            siteId: '',
            siteName: '',
            persona: null
        };
    }
}
