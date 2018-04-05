import { MultiSelectModule } from 'primeng/primeng';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotWorkflowsSelectorFieldComponent } from './dot-workflows-selector-field.component';

@NgModule({
    imports: [CommonModule, MultiSelectModule],
    declarations: [DotWorkflowsSelectorFieldComponent]
})
export class DotWorkflowsSelectorFieldModule {}
