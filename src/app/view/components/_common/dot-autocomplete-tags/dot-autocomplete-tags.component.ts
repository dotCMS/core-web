import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotTagsService } from '@services/dot-tags/dot-tags.service';
import { DotTag } from '@models/dot-tag';
import { filter, mergeMap, toArray } from 'rxjs/operators';

@Component({
    selector: 'dot-autocomplete-tags',
    templateUrl: './dot-autocomplete-tags.component.html',
    styleUrls: ['./dot-autocomplete-tags.component.css']
})
export class DotAutocompleteTagsComponent implements OnInit {
    @Input() inputId: string;
    @Input() value: any[] = [];
    @Input() options: any[];
    @Input() placeholder: string;

    @Output() onChange = new EventEmitter<any>();

    filteredOptions: DotTag[];

    constructor(private dotTagsService: DotTagsService) {}

    ngOnInit() {
        this.filterOptions();
        this.value = this.value === null ? [] : this.value;
    }

    filterOptions(event?: any) {
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

    checkForTag(event: KeyboardEvent) {
        const input: HTMLInputElement = event.currentTarget as HTMLInputElement;
        if (event.key === 'Enter' && this.isUniqueTag(input.value)) {
            this.value.push(input.value);
            this.onChange.emit(this.value);
            input.value = null;
        }
    }
    addItem(tag: DotTag) {
        this.value.splice(-1, 1);
        if (this.isUniqueTag(tag.label)) {
            this.value.push(tag.label);
            this.onChange.emit(this.value);
        }
    }

    removeItem(_item: any) {
        this.onChange.emit(this.value);
    }

    private isUniqueTag(tag: string): boolean {
        return !!tag && !this.value.includes(tag);
    }
}
