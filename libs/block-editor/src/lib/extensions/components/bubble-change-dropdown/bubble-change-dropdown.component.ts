import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { DotMenuItem, SuggestionsComponent } from '@dotcms/block-editor';

@Component({
    selector: 'dotcms-bubble-change-dropdown',
    templateUrl: './bubble-change-dropdown.component.html',
    styleUrls: ['./bubble-change-dropdown.component.scss']
})
export class BubbleChangeDropdownComponent {
    @Input() options: DotMenuItem[];
    @Input() selected: DotMenuItem;
    @Input() showSuggestions = false;

    @ViewChild('suggestions') suggestions: SuggestionsComponent;

    constructor(public elementRef: ElementRef) {}

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
     * Execute the item command
     *
     * @memberof BubbleChangeDropdownComponent
     */
    execCommand() {
        this.suggestions.execCommand();
    }

    /**
     * Toggle the visibility of the Suggestions.
     *
     * @memberof BubbleChangeDropdownComponent
     */
    updateActiveItem() {
        if (this.showSuggestions) {
            //wait render of suggestion component.
            setTimeout(() => {
                this.suggestions.updateActiveItem(
                    this.options.findIndex((item) => item === this.selected)
                );
            }, 0);
        }
    }
}
