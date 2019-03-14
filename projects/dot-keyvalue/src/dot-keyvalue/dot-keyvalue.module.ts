import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { DotKeyvalueComponent } from './dot-keyvalue.component';
import { DotKeyvalueItemModule } from './dot-keyvalue-item/dot-keyvalue-item.module';
import { DotKeyvalueListModule } from './dot-keyvalue-list/dot-keyvalue-list.module';

@NgModule({
  declarations: [
    DotKeyvalueComponent
  ],
  imports: [
    BrowserModule,
    DotKeyvalueItemModule,
    DotKeyvalueListModule
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
