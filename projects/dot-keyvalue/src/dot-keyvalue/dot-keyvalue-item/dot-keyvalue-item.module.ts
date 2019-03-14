import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule, InputTextModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';


import { DotKeyvalueItemComponent } from './dot-keyvalue-item.component';

@NgModule({
  declarations: [
    DotKeyvalueItemComponent
  ],
  imports: [
    ButtonModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    TableModule
  ],
  exports: [DotKeyvalueItemComponent]
})
export class DotKeyvalueItemModule {
}
