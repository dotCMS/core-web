import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotImageEditorComponent } from './dot-image-editor.component';
import { FormsModule } from '@angular/forms';
import { EditControlsComponent } from './components/edit-controls/edit-controls.component';
import { ImageContainerComponent } from './components/image-container/image-container.component';

// PrimeNg
import { ButtonModule } from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';


@NgModule({
  declarations: [DotImageEditorComponent, EditControlsComponent, ImageContainerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule
  ],
  exports: [
    DotImageEditorComponent
  ]
})
export class DotImageEditorModule { }
