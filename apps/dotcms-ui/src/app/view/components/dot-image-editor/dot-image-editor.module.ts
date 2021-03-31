import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotImageEditorComponent } from './dot-image-editor.component';
import { FormsModule } from '@angular/forms';
import { DotEditControlsComponent } from './components/dot-edit-controls/dot-edit-controls.component';
import { DotImageContainerComponent } from './components/dot-image-container/dot-image-container.component';

// PrimeNg
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';

@NgModule({
  declarations: [
    DotImageEditorComponent,
    DotEditControlsComponent,
    DotImageContainerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    SliderModule,
    InputTextModule,
    DividerModule,
  ],
  exports: [
    DotImageEditorComponent
  ]
})
export class DotImageEditorModule { }
