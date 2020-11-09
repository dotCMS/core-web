import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotTemplateCreateEditComponent } from './dot-template-create-edit.component';
import { DotTemplateCreateEditRoutingModule } from './dot-template-create-edit-routing.module';
import { DotTemplateDesignerModule } from './dot-template-designer/dot-template-designer.module';

@NgModule({
    imports: [CommonModule, DotTemplateCreateEditRoutingModule, DotTemplateDesignerModule],
    declarations: [DotTemplateCreateEditComponent]
})
export class DotTemplateCreateEditModule {}
