import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { DotKeyvalueComponent } from './dot-keyvalue.component';
// import { DotKeyvalueItemComponent } from './dot-keyvalue-item/dot-keyvalue-item.component';
// import { DotKeyvalueListComponent } from './dot-keyvalue-list/dot-keyvalue-list.component';
import { DotTestComponent } from './dot-test/dot-test.component';
import { DotKeyvalueItemModule } from './dot-keyvalue-item/dot-keyvalue-item.module';
import { DotKeyvalueListModule } from './dot-keyvalue-list/dot-keyvalue-list.module';
// import { DotTestModule } from './dot-test/dot-test.module';

@NgModule({
  declarations: [
    DotKeyvalueComponent,
    // DotKeyvalueItemComponent,
    // DotKeyvalueListComponent
    DotTestComponent
  ],
  imports: [
    BrowserModule,
    DotKeyvalueItemModule,
    DotKeyvalueListModule,
    // DotTestModule
  ],
  providers: [],
  entryComponents: [DotKeyvalueComponent,
    DotTestComponent
],
  exports: [DotKeyvalueComponent, DotTestComponent]
})
export class DotKeyvalueModule {
    constructor(private injector: Injector) {}

    ngDoBootstrap() {
        const elem = createCustomElement(DotKeyvalueComponent, {injector: this.injector});
        customElements.define('dot-keyvalue', elem);
        const elem2 = createCustomElement(DotTestComponent, {injector: this.injector});
        customElements.define('dot-test', elem2);
    }
}
