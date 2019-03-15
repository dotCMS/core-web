import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { DotTestComponent } from './dot-test.component';

@NgModule({
  declarations: [
    DotTestComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [DotTestComponent]
})
export class DotTestModule {
}
