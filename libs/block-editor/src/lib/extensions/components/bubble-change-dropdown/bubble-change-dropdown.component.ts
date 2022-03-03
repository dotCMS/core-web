import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DotMenuItem, SuggestionsComponent } from '@dotcms/block-editor';

@Component({
    selector: 'dotcms-bubble-change-dropdown',
    templateUrl: './bubble-change-dropdown.component.html',
    styleUrls: ['./bubble-change-dropdown.component.scss']
})
export class BubbleChangeDropdownComponent implements OnInit {
    @Input() options: DotMenuItem[];
    @Input() selectedOption: DotMenuItem;
    @Output() selected: EventEmitter<DotMenuItem> = new EventEmitter(false);

    @ViewChild('suggestions') suggestions: SuggestionsComponent;

    showSuggestions = false;

    constructor() {}

    ngOnInit(): void {
        console.log('test');
    }

    /**
     * Update the current item selected
     *
     * @param {KeyboardEvent} event
     * @memberof BubbleChangeDropdownComponent
     */
    updateSelection(event: KeyboardEvent) {
        this.suggestions.updateSelection(event);
    }

    /**
     * Toggle the visibility of the Suggestions.
     *
     * @memberof BubbleChangeDropdownComponent
     */
    toggleSuggestions() {
        this.showSuggestions = !this.showSuggestions;
        if (this.showSuggestions) {
            setTimeout(() => {
                this.suggestions.updateActiveItem(
                    this.options.findIndex((item) => item === this.selectedOption)
                );
            }, 0);
        }
    }
}
