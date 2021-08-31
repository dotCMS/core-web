import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { OrderListModule } from 'primeng/orderlist';
import { ListboxModule } from 'primeng/listbox';

import { AppComponent } from './app.component';
import { DotBlockEditorComponent } from './dot-block-editor/dot-block-editor.component';
import { NgxTiptapModule } from '../../../../libs/block-editor/src/lib/ngx-tiptap.module';

@NgModule({
    declarations: [AppComponent, DotBlockEditorComponent],
    imports: [BrowserModule, CommonModule, FormsModule, NgxTiptapModule, OrderListModule, ListboxModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
