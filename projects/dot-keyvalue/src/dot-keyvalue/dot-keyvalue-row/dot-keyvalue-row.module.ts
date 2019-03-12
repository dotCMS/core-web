import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule, InputTextModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
// import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';


import { DotKeyvalueRowComponent } from './dot-keyvalue-row.component';

@NgModule({
  declarations: [
    DotKeyvalueRowComponent
  ],
  imports: [
    ButtonModule,
    CommonModule,
    // DotIconButtonModule,
    InputTextModule,
    FormsModule,
    TableModule
  ],
  exports: [DotKeyvalueRowComponent]
})
export class DotKeyvalueRowModule {
}
