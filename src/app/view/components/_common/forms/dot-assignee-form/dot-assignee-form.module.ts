import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotAssigneeFormComponent } from '@components/_common/forms/dot-assignee-form/dot-assignee-form.component';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, FormsModule, DotPipesModule, DropdownModule],
    declarations: [DotAssigneeFormComponent],
    exports: [DotAssigneeFormComponent]
})
export class DotAssigneeFormModule {}
