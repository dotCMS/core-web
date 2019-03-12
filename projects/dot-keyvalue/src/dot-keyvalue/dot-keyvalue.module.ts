import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule } from '@angular/forms';
import { ButtonModule, InputTextModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
// import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';


import { DotKeyvalueComponent } from './dot-keyvalue.component';
import { DotKeyvalueItemModule } from './dot-keyvalue-item/dot-keyvalue-item.module';
import { DotKeyvalueRowModule } from './dot-keyvalue-row/dot-keyvalue-row.module';

@NgModule({
  declarations: [
    DotKeyvalueComponent
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    CommonModule,
    // DotIconButtonModule,
    InputTextModule,
    FormsModule,
    TableModule,
    DotKeyvalueItemModule,
    DotKeyvalueRowModule
  ],
  providers: [],
  entryComponents: [DotKeyvalueComponent],
  exports: [DotKeyvalueComponent]
})
export class DotKeyvalueModule {
    constructor(private injector: Injector) {}

    ngDoBootstrap() {
        const elem = createCustomElement(DotKeyvalueComponent, {injector: this.injector});
        customElements.define('dot-keyvalue', elem);
    }
}
