import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotImageEditorComponent } from './dot-image-editor.component';
import { FormsModule } from '@angular/forms';
import { EditControlsComponent } from './components/edit-controls/edit-controls.component';



@NgModule({
  declarations: [DotImageEditorComponent, EditControlsComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    DotImageEditorComponent
  ]
})
export class DotImageEditorModule { }
