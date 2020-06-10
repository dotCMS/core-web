import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';

import { DotWorkflowsActionsSelectorFieldComponent } from './dot-workflows-actions-selector-field.component';
import { DotWorkflowsActionsService } from '@services/dot-workflows-actions/dot-workflows-actions.service';
import { DotWorkflowsActionsSelectorFieldService } from './services/dot-workflows-actions-selector-field.service';
import { DotDirectivesModule } from '@shared/dot-directives.module';

@NgModule({
    providers: [DotWorkflowsActionsService, DotWorkflowsActionsSelectorFieldService],
    declarations: [DotWorkflowsActionsSelectorFieldComponent],
    exports: [DotWorkflowsActionsSelectorFieldComponent],
    imports: [CommonModule, DropdownModule, FormsModule, DotDirectivesModule]
})
export class DotWorkflowsActionsSelectorFieldModule {}
