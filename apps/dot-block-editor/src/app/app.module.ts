import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { OrderListModule } from 'primeng/orderlist';
import { ListboxModule } from 'primeng/listbox';

import { DotBlockEditorComponent } from './dot-block-editor/dot-block-editor.component';

import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { NgxTiptapModule } from '@dotcms/block-editor';

@NgModule({
    declarations: [AppComponent, DotBlockEditorComponent],
    imports: [BrowserModule, CommonModule, FormsModule, NgxTiptapModule, OrderListModule, ListboxModule],
    providers: [],
    entryComponents: [DotBlockEditorComponent]
})
export class AppModule {

    constructor(private injector: Injector) {}

    ngDoBootstrap() {
        const element = createCustomElement(DotBlockEditorComponent, {
          injector: this.injector
        });
     
        customElements.define('dot-block-editor', element);
    }

}
