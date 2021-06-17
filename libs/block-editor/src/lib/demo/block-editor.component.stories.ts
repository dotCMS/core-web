import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { OrderListModule } from 'primeng/orderlist';
import { of } from 'rxjs';
import { NgxTiptapModule } from '../ngx-tiptap.module';
import { SuggestionsService } from '../services/suggestions.service';
import { BlockEditorComponent } from './block-editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContentletBlockComponent } from '../extentions/contentlet-block/contentlet-block.component';
import { SuggestionListComponent } from '../suggestion-list/suggestion-list.component';

export default {
    title: 'BlockEditorComponent'
};

export const primary = () => ({
    moduleMetadata: {
        imports: [
            CommonModule,
            FormsModule,
            NgxTiptapModule,
            OrderListModule,
            ListboxModule,
            BrowserAnimationsModule
        ],
        providers: [
            {
                provide: SuggestionsService,
                useValue: {
                    getContentTypes() {
                        return of([
                            {
                                name: 'Blog'
                            },
                            {
                                name: 'Persona'
                            },
                            {
                                name: 'News Item'
                            },
                            {
                                name: 'Banner'
                            },
                            {
                                name: 'Product in the store'
                            },
                            {
                                name: 'Reatil information'
                            }
                        ]);
                    },
                    getContentlets() {
                        return of([
                            {
                                title: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
                            },
                            {
                                title: 'Aliquam tincidunt mauris eu risus.'
                            },
                            {
                                title: 'Vestibulum auctor dapibus neque.'
                            },
                            {
                                title: 'Nunc dignissim risus id metus.'
                            },
                            {
                                title: 'Cras ornare tristique elit.'
                            },
                            {
                                title: 'Vivamus vestibulum ntulla nec ante.'
                            }
                        ]);
                    }
                }
            }
        ],
        // We need this 2 here because they are dynamically rendered
        entryComponents: [SuggestionListComponent, ContentletBlockComponent]
    },
    component: BlockEditorComponent
});
