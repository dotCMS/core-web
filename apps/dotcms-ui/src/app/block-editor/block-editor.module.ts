import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockEditorComponent } from './block-editor.component';

import { NgxTiptapModule } from 'block-editor';
import { FormsModule } from '@angular/forms';
import { BlockEditorRoutingModule } from './bloc-editor-routing.module';
import { DotPortletBaseModule } from '../view/components/dot-portlet-base/dot-portlet-base.module';
import { OrderListModule } from 'primeng/orderlist';
import { ListboxModule } from 'primeng/listbox';

@NgModule({
    declarations: [BlockEditorComponent],
    exports: [BlockEditorComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgxTiptapModule,
        BlockEditorRoutingModule,
        DotPortletBaseModule,
        OrderListModule,
        ListboxModule
    ]
})
export class BlockEditorModule {}
