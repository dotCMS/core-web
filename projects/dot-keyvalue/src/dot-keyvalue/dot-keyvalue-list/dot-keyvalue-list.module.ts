import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule, InputTextModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';


import { DotKeyvalueListComponent } from './dot-keyvalue-list.component';

@NgModule({
  declarations: [
    DotKeyvalueListComponent
  ],
  imports: [
    ButtonModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    TableModule
  ],
  exports: [DotKeyvalueListComponent]
})
export class DotKeyvalueListModule {
}
