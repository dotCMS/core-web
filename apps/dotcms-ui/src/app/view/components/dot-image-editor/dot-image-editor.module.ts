import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotImageEditorComponent } from './dot-image-editor.component';



@NgModule({
  declarations: [DotImageEditorComponent],
  imports: [
    CommonModule
  ],
  exports: [
    DotImageEditorComponent
  ]
})
export class DotImageEditorModule { }
