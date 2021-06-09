import { NgModule } from '@angular/core';

import { EditorDirective } from './editor.directive';
import { FloatingMenuDirective } from './floating-menu.directive';
import { BubbleMenuDirective } from './bubble-menu.directive';
import { DraggableDirective } from './draggable.directive';
import { NodeViewContentDirective } from './node-view-content.directive';
import { SuggestionMenuDirective } from './directives/suggestion-menu.directive';

@NgModule({
    declarations: [
        EditorDirective,
        FloatingMenuDirective,
        BubbleMenuDirective,
        DraggableDirective,
        NodeViewContentDirective,
        SuggestionMenuDirective
    ],
    exports: [
        EditorDirective,
        FloatingMenuDirective,
        BubbleMenuDirective,
        DraggableDirective,
        NodeViewContentDirective,
        SuggestionMenuDirective
    ]
})
export class NgxTiptapModule {}
