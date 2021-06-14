import { NgModule } from '@angular/core';

import { EditorDirective } from './editor.directive';
import { FloatingMenuDirective } from './floating-menu.directive';
import { BubbleMenuDirective } from './bubble-menu.directive';
import { DraggableDirective } from './draggable.directive';
import { NodeViewContentDirective } from './node-view-content.directive';
import { SuggestionMenuDirective } from './directives/suggestion-menu.directive';
import { SuggestionListComponent } from './suggestion-list/suggestion-list.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';

import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule, MenuModule],
    declarations: [
        EditorDirective,
        FloatingMenuDirective,
        BubbleMenuDirective,
        DraggableDirective,
        NodeViewContentDirective,
        SuggestionMenuDirective,
        SuggestionListComponent,
        SuggestionsComponent
    ],
    exports: [
        SuggestionsComponent,
        EditorDirective,
        FloatingMenuDirective,
        BubbleMenuDirective,
        DraggableDirective,
        NodeViewContentDirective,
        SuggestionMenuDirective
    ]
})
export class NgxTiptapModule {}
