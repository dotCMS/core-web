import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { OrderListModule } from 'primeng/orderlist';
import { of } from 'rxjs';
import { NgxTiptapModule } from '../ngx-tiptap.module';
import { SuggestionsService } from '../services/suggestions.service';
import { BlockEditorComponent } from './block-editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
                                name: 'Hello World'
                            }
                        ]);
                    },
                    getContentlets() {
                        return of([
                            {
                                title: 'I am a contentlet'
                            }
                        ]);
                    }
                }
            }
        ]
    },
    component: BlockEditorComponent
    // props: {
    //     editor: text('editor')
    // }
});
