import { MultiSelectModule } from 'primeng/primeng';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotWorkflowsSelectorFieldComponent } from './dot-workflows-selector-field.component';
import { FormsModule } from '@angular/forms';
import { DotDirectivesModule } from '@shared/dot-directives.module';

@NgModule({
    imports: [CommonModule, MultiSelectModule, FormsModule, DotDirectivesModule],
    declarations: [DotWorkflowsSelectorFieldComponent],
    exports: [DotWorkflowsSelectorFieldComponent]
})
export class DotWorkflowsSelectorFieldModule {}
