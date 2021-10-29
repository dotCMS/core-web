import { NgModule } from '@angular/core';

import { EditorDirective } from './editor.directive';
import { BubbleMenuDirective } from './bubble-menu.directive';
import { DraggableDirective } from './draggable.directive';
import { NodeViewContentDirective } from './node-view-content.directive';

import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ContentletBlockComponent } from './extensions/blocks/contentlet-block/contentlet-block.component';

import { SuggestionsService } from './extensions/services/suggestions.service';
import { SuggestionsComponent } from './extensions/components/suggestions/suggestions.component';
import { SuggestionListComponent } from './extensions/components/suggestion-list/suggestion-list.component';
import { ActionButtonComponent } from './extensions/components/action-button/action-button.component';
import { SuggestionsListItemComponent } from './extensions/components/suggestions-list-item/suggestions-list-item.component';
import { LoggerService } from '@dotcms/dotcms-js';
import { StringUtils } from '@dotcms/dotcms-js';
import { DragHandlerComponent } from './extensions/components/drag-handler/drag-handler.component';
import { BubbleMenuComponent } from './extensions/components/bubble-menu/bubble-menu.component';
import { BubbleMenuButtonComponent } from './extensions/components/bubble-menu-button/bubble-menu-button.component';

@NgModule({
    imports: [CommonModule, CardModule, MenuModule],
    declarations: [
        EditorDirective,
        BubbleMenuDirective,
        DraggableDirective,
        NodeViewContentDirective,
        SuggestionsComponent,
        SuggestionListComponent,
        SuggestionsListItemComponent,
        ContentletBlockComponent,
        ActionButtonComponent,
        DragHandlerComponent,
        BubbleMenuComponent,
        BubbleMenuButtonComponent
    ],
    providers: [SuggestionsService, LoggerService, StringUtils],
    exports: [
        SuggestionsComponent,
        EditorDirective,
        BubbleMenuDirective,
        DraggableDirective,
        NodeViewContentDirective,
        ActionButtonComponent
    ]
})
export class NgxTiptapModule { }
