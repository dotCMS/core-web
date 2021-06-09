import { Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { SuggestionMenuDirective } from '../../../../../libs/block-editor/src/lib/directives/suggestion-menu.directive';
import { DotContent } from '../../../../../libs/block-editor/src/lib/extentions/dotContent.extention';

@Component({
    selector: 'dot-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnChanges {
    @ViewChild('suggestion') suggestionDirective: SuggestionMenuDirective;
    items: any;
    editor = new Editor({
        extensions: [StarterKit, DotContent]
    });
    selectedItem: any;

    value = '<p>Hello, Tiptap!</p>'; // can be HTML or JSON, see https://www.tiptap.dev/api/editor#content

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);
    }

    handleSlected(event: any): void {
        this.selectedItem = event.option;
        // this.suggestionDirective.selected = event;
    }

    loadItems(items: any): void {
        this.items = items;
    }
}
