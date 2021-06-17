import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { text } from '@storybook/addon-knobs';
import { ListboxModule } from 'primeng/listbox';
import { OrderListModule } from 'primeng/orderlist';
import { NgxTiptapModule } from '../ngx-tiptap.module';
import { BlockEditorComponent } from './block-editor.component';

export default {
    title: 'BlockEditorComponent'
};

export const primary = () => ({
    moduleMetadata: {
        imports: [CommonModule,
            FormsModule,
            NgxTiptapModule,
            OrderListModule,
            ListboxModule]
    },
    component: BlockEditorComponent,
    // props: {
    //     editor: text('editor')
    // }
});
