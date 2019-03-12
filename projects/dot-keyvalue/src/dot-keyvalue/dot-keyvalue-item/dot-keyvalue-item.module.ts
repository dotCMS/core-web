import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule, InputTextModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
// import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';


import { DotKeyvalueItemComponent } from './dot-keyvalue-item.component';

@NgModule({
  declarations: [
    DotKeyvalueItemComponent
  ],
  imports: [
    ButtonModule,
    CommonModule,
    // DotIconButtonModule,
    InputTextModule,
    FormsModule,
    TableModule
  ],
  exports: [DotKeyvalueItemComponent]
})
export class DotKeyvalueItemModule {
}
